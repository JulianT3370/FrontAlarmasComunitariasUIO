from dotenv import load_dotenv
import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from google.cloud import speech_v1 as speech
from pydub import AudioSegment
from pydub.utils import which
import b2sdk.v2
# Trabajar con archivos wav
import wave
from flask_cors import CORS
from datetime import datetime
from haversine import formula
import subprocess
import mysql.connector
from connection.conn import db_config

load_dotenv()

app = Flask(__name__)
CORS(app)


def account_credentials():
    info = b2sdk.v2.InMemoryAccountInfo()
    api = b2sdk.v2.B2Api(info)
    appKeyId = os.getenv("ACCOUNT_ID")
    appKey = os.getenv("APPLICATION_KEY")
    api.authorize_account("production", appKeyId, appKey)
    return api

# Usado para manipular archivos de audio, en este caso convertir formatos
# Busca ffmpeg en el sistema para trabajar con distintos formatos de audio
AudioSegment.ffmpeg = which("ffmpeg")
client = speech.SpeechClient.from_service_account_file(os.getenv("CREDENTIAL"))

# Obtener la tasa de muestreo del archivo .wav
def getSampleRate(file):
    with wave.open(file, "rb") as wav_file:
        sample_rate = wav_file.getframerate()
        return sample_rate

def transcribir(input_file, sample_rate):
    # Abrir el archivo en formato de binarios y solo lectura
    with open(input_file, 'rb') as audio_file:
        # Lee el contenido completo del archivo
        content = audio_file.read()
        # Usar el modelo de google para pasar de audio a texto
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            # Configuració para archivos .wav sin comprimir
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16,
            # Ajustar a la misma tasa de muestre de un archivo .wav
            sample_rate_hertz = sample_rate,
            # Lenguaje en el que se esta implementando la api
            language_code = "es-ES"
        )
        # Aplica la configuración al audio y guarda el resultado en la variable
        response = client.recognize(config=config, audio=audio)
        data = {}
        # Asignar los resultados al diccionario para enviarlos al cliente
        for result in response.results:
            data["transcripcion"] = result.alternatives[0].transcript
            data["valor"] = result.alternatives[0].confidence
    return data

@app.route("/upload", methods=["POST"])
def upload():
    try:
        fecha_hora_actual = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Obtener el archivo subido
        file = request.files["file"]
        file_path = os.path.join("recordings", file.filename)
        file.save(file_path)

        # Convertir a WAV (mono)
        audio = AudioSegment.from_file(file_path, format="m4a")
        wav_path = file_path.replace(".m4a", ".wav")
        audio.set_channels(1).export(wav_path, format="wav")

        # Subir a bucket
        api = account_credentials()
        bucket = api.get_bucket_by_name(os.getenv("BUCKET_NAME"))

        audioName = "audio-"+fecha_hora_actual+".wav"
        with open(wav_path, "rb") as wav_file:
            bucket.upload_bytes(wav_file.read(), audioName)

        try:
            # Descargar desde el bucket
            local_file_name = os.path.join("recordings", audioName)
            downloaded_bytes = bucket.download_file_by_name(audioName)
            # Guardar el archivo descargado
            downloaded_bytes.save_to(local_file_name);
            
            # Obtener sample rate y transcribir
            sample_rate = getSampleRate(local_file_name)
            data = transcribir(local_file_name, sample_rate)

            # Limpiar archivos locales
            os.remove(file_path)
            os.remove(wav_path)
            os.remove(local_file_name)

            return jsonify(data)
        
        except Exception as e:
            return jsonify({"error": f"Error en la descarga/transcripción: {str(e)}"}), 500
        
    except Exception as e:
        app.logger.error(f"Error processing the file: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route("/text", methods=["POST"])
def textoTitulo():
    text = request.json.get("text")
    api_key = os.getenv("API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    prompt = f"""
        Analiza la siguiente descripción de una situación:
        "{text}"

        1. Verifica si el contenido está relacionado con seguridad comunitaria.
        - Si **no está relacionado**, responde con: No está relacionado.
        
        2. Si el contenido **sí está relacionado**, genera un título de máximo 3 palabras que resuma el tema principal.
        - Devuelve **únicamente el título**, sin ninguna explicación, contexto ni formato adicional.
        - Asegúrate de que el título sea **conciso y específico**, evitando frases genéricas o ambiguas.
    """
    response = model.generate_content(prompt)
    return jsonify(response.text)

@app.route("/haversine", methods = ["POST"])
def calcularDistancia():
    data = request.json.get("data")
    coordenadas = data["coordenadas"]
    sectores = data["sectores"]
    titulo = data["titulo"]
    distancias = []
    datos = {}
    for sector in sectores:
        result = {}
        lat = sector["latitud"]
        lon = sector["longitud"]
        clat = coordenadas["latitude"]
        clon = coordenadas["longitude"]
        distancia = formula(float(lat), float(lon), clat, clon, 6371)
        result["name"] = sector["nombre"]
        if(distancia > 45):
            continue
        result["status"] = distancia <= 45
        distancias.append(result)
        # result[sector["name"]+"-distancia"] = distancia
    if(len(distancias) < 1):
        return jsonify({"message" : "No hay sectores cerca"}), 400
    datos["sectores"] = distancias
    datos["title"] = titulo
    datos["origen"] = coordenadas
    return jsonify(datos)

@app.route("/get_sectores", methods = ["GET"])
def getSectores():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sectores")
    sectores = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(sectores)

@app.route("/sector", methods = ["POST"])
def sector():
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        data = request.json.get("data")
        nombre = data["nombre"]
        cursor.execute("SELECT * from sectores WHERE nombre = %s", (nombre,))
        result = cursor.fetchone()
        if(result):
            cursor.close()
            connection.close()
            return jsonify({"message" : "El sector ya se encuentra registrado"}), 400

        latitud = data["latitud"]
        longitud = data["longitud"]
        ipCam = data["ip"]
        if(data["usr"] and data["pass"]):
            usr = data["usr"]
            pas = data["pass"]
            query = "INSERT INTO sectores (nombre, latitud, longitud, ip_camara, usuario, password) VALUES (%s, %s, %s, %s, %s, %s)"
            values = (nombre, latitud, longitud, ipCam, usr, pas)
            cursor.execute(query, values)
            connection.commit()
        else:
            query = "INSERT INTO sectores (nombre, latitud, longitud, ip_camara) VALUES (%s, %s, %s, %s)"
            values = (nombre, latitud, longitud, ipCam)
            cursor.execute(query, values)
            connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message" : "Se ha registrado el sector"})

@app.route("/alarma", methods=["POST"])
def alarma():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    data = request.json.get("data")
    titulo = data["title"]
    latitud = data["origen"]["latitude"]
    longitud = data["origen"]["longitude"]
    query = "INSERT INTO alarmas (titulo, latitud, longitud) VALUES (%s, %s, %s)"
    values = (titulo, latitud, longitud)
    cursor.execute(query, values)
    alarma_id = cursor.lastrowid
    sectores = data["sectores"]
    queryAS = "INSERT INTO alarma_sectores (alarma_id, sector_id) VALUES (%s, %s)"
    for sector in sectores:
        queryS = "SELECT id FROM sectores WHERE nombre = %s"
        valuesS = (sector["name"],)
        cursor.execute(queryS, valuesS)
        idSector = cursor.fetchone()
        cursor.execute(queryAS, (alarma_id, idSector["id"]))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message" : "Se ha registrado el alarma"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
