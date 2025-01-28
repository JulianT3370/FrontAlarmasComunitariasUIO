from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from google.cloud import speech_v1 as speech
from pydub import AudioSegment
from pydub.utils import which
# Trabajar con archivos wav
import wave
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app)
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
        # Obtener el archivo subido
        file = request.files["file"]
        file_path = os.path.join("recordings", file.filename)
        file.save(file_path)

        audio = AudioSegment.from_file(file_path, format="m4a")
        wav_path = os.path.join("recordings", file.filename.replace(".m4a", ".wav"))
        audio.set_channels(1).export(wav_path, format="wav")
        sample_Rate = getSampleRate(wav_path)
        data = transcribir(wav_path, sample_Rate)
        
        return jsonify(data)
    except Exception as e:
        # Loguear el error y devolver una respuesta con el mensaje de error
        app.logger.error(f"Error processing the file: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
