import sounddevice as sd
import scipy.io.wavfile as wav
import whisper
import tempfile
import numpy as np
import os
import time

model = whisper.load_model("medium")

# Optional: print available devices
#print("\nAvailable audio devices:")
#print(sd.query_devices())
# sd.default.device = (2, None)  # Uncomment and set input device index if needed

def record_audio(filename, duration=15, fs=16000):
    print("🎤 Recording...")
    audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32')
    sd.wait()
    
    # Normalize to [-1, 1] and convert to int16
    audio = audio / np.max(np.abs(audio))
    audio_int16 = np.int16(audio * 32767)
    wav.write(filename, fs, audio_int16)

def transcribe_audio(filename):
    print("Transcribing...")
    start_time=time.time()
    result = model.transcribe(filename, language ="en")
    end_time=time.time()
    print("Transcribe time", end_time-start_time)
    text = result.get('text', '')
    language = result.get('language', 'unknown')
    print("----------------------------------------------")
    print(f" Whisper Result:\n  Text: {text}\n  Language: {language}")
    return text

# === Main ===
if _name_ == "_main_":
    print("🔊 Whisper Speech-to-Text System")

    while True:
        path = input(">> ").strip()

        if path.lower() == "exit":
            print(" Exiting the program. Goodbye!")
            break

        elif path == "":
            # No path entered: Record from mic
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp:
                record_audio(temp.name, duration=5)
                audio_path = temp.name

        elif os.path.isfile(path):
            # Valid file path given
            audio_path = path

        else:
            print("Invalid path. Try again or type 'exit' to quit.")
            continue  # Restart the loop

        # Transcribe
        user_input = transcribe_audio(audio_path)

        if user_input.strip() == "":
            print(" No speech detected.")
        else:
            print(" Final Transcript:", user_input)
        print("\n Ready for next input (or type 'exit'):")