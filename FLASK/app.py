from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from google.cloud import speech_v1 as speech
from pydub import AudioSegment
from pydub.utils import which
import wave
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app)
AudioSegment.ffmpeg = which("ffmpeg")
client = speech.SpeechClient.from_service_account_file(os.getenv("CREDENTIAL"))

def getSampleRate(file):
    with wave.open(file, "rb") as wav_file:
        sample_rate = wav_file.getframerate()
        return sample_rate

def convertToMono(input_file, output_file):
    audio = AudioSegment.from_file(input_file)
    audio = audio.set_channels(1)
    audio.export(output_file, format="wav")

def transcribir(input_file, sample_rate):
    with open(input_file, 'rb') as audio_file:
        content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz = sample_rate,
            language_code = "es-ES"
        )
        response = client.recognize(config=config, audio=audio)
        data = {}
        for result in response.results:
            data["trasncripcion"] = result.alternatives[0].transcript
            data["valor"] = result.alternatives[0].confidence
    return data

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    file_path = os.path.join("recordings", file.filename)
    file.save(file_path)

    audio = AudioSegment.from_file(file_path, format="m4a")
    wav_path = file_path.replace(".m4a", ".wav")
    audio.export(wav_path, format="wav")


    sample_Rate = getSampleRate(file=wav_path)
    mono_wav_path = wav_path.replace(".wav", "_mono.wav")
    convertToMono(wav_path, mono_wav_path)
    data = transcribir(mono_wav_path, sample_Rate)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
