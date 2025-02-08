from dotenv import load_dotenv
import os
import google.generativeai as genai
from flask import Flask, request, jsonify
# Trabajar con archivos wav
import wave
from flask_cors import CORS
from datetime import datetime
from haversine import formula
from connection.firebase import db
from Backblaze.cdn import *
from Audio.audio import getSampleRate, transcribir, transformar_audio

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
    try:
        fecha_hora_actual = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Obtener el archivo subido
        file = request.files["file"]
        file_path = os.path.join("recordings", file.filename)
        file.save(file_path)

        wav_path = transformar_audio(file_path=file_path)

        # Subir a bucket
        api = account_credentials()
        bucket = findBucket(api)

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
        if(distancia <= 45):
            result["name"] = sector["id"]
            result["status"] = distancia <= 45
            distancias.append(result)
        
    if(len(distancias) < 1):
        return jsonify({"message" : "No hay sectores cerca"}), 400
        
    datos["sectores"] = distancias
    datos["title"] = titulo
    datos["origen"] = coordenadas
    try:
        fetchAlarm(datos)
        return datos
    except:
        return jsonify({"message" : "Error inesperado"}),400
    
# @app.route("/alarma", methods = ["POST"])
def fetchAlarm(datos):
    data = datos
    titulo = data["title"]
    latitud = data["origen"]["latitude"]
    longitud = data["origen"]["longitude"]
    alarma = db.collection("alarmas").document()
    alarma.set({ "titulo" : titulo, "latitud" : float(latitud), "longitud" : float(longitud) })
    sectores = data["sectores"]
    print(sectores)
    for sector in sectores:
        if(sector["status"]):
            sector_alarma = db.collection("sector_alarma").document()
            sector_alarma.set({ "alarma_id": alarma.id, "sector_name": sector["name"] })

@app.route("/sendSector", methods=["POST"])
def sendSector():
    data = request.json.get("data")
    nombre = data["name"]

    try:
        sector = db.collection("sectores").document(nombre)
        validSec = sector.get()

        if(validSec.exists):
            return jsonify({ "message" : "El sector con el nombre " + nombre + " ya se encuentra registrado." }), 400
        else:
            latitud = data["latitude"]
            longitud = data["longitude"]
            camara_data = data.get("camera")
            if(camara_data):
                ipCam = data["camera"]["ip"]
                usr = data["camera"]["user"]
                pas = data["camera"]["password"]
                sector.set({ "latitud" : latitud, "longitud" : longitud, "ip_camara" : ipCam, "usuario" : usr, "password" : pas })
            else:
                sector.set({ "latitud" : latitud, "longitud" : longitud })
            return jsonify({"message" : "El sector " + nombre + " se ha registrado el sector"})
    except:
        return jsonify({"message" : "Ha ocurrido un error."}), 400

@app.route("/fgetSectores", methods = ["GET"])
def getSectoresFirebase():
    sectores_ref = db.collection("sectores")
    docs = sectores_ref.stream()
    sectores = []
    for doc in docs:
        sectores.append({ "id": doc.id, **doc.to_dict() })

    return jsonify(sectores)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
