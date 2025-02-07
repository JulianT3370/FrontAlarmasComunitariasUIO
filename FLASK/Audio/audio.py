import wave
from google.cloud import speech_v1 as speech
from pydub import AudioSegment
from pydub.utils import which
import os

# Usado para manipular archivos de audio, en este caso convertir formatos
# Busca ffmpeg en el sistema para trabajar con distintos formatos de audio
AudioSegment.ffmpeg = which("ffmpeg")
client = speech.SpeechClient.from_service_account_file(os.getenv("CREDENTIAL"))

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

def transformar_audio(file_path):
    # Convertir a WAV (mono)
    audio = AudioSegment.from_file(file_path, format="m4a")
    wav_path = file_path.replace(".m4a", ".wav")
    audio.set_channels(1).export(wav_path, format="wav")
    return wav_path