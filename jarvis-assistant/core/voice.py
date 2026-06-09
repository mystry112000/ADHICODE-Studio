import queue
import speech_recognition as sr
import pyttsx3
import threading

class VoiceEngine:
    def __init__(self, stt_engine="google", tts_engine="pyttsx3"):
        self.stt_engine = stt_engine
        self.tts_engine_type = tts_engine
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 3000
        self.recognizer.dynamic_energy_threshold = True
        self.mic = sr.Microphone()
        self.mic_lock = threading.Lock()
        self.tts_queue = queue.Queue()
        self._init_tts()

        with self.mic as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)

    def _init_tts(self):
        if self.tts_engine_type == "pyttsx3":
            self.tts_engine = pyttsx3.init()
            self.tts_engine.setProperty("rate", 180)
            self.tts_engine.setProperty("volume", 0.9)
            voices = self.tts_engine.getProperty("voices")
            if voices:
                self.tts_engine.setProperty("voice", voices[1].id if len(voices) > 1 else voices[0].id)
        else:
            self.tts_engine = None

    def listen(self, timeout=5, phrase_limit=10):
        with self.mic_lock:
            try:
                with self.mic as source:
                    audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_limit)
            except sr.WaitTimeoutError:
                return ""

        try:
            if self.stt_engine == "google":
                return self.recognizer.recognize_google(audio).lower()
            elif self.stt_engine == "whisper":
                return self.recognizer.recognize_whisper(audio, model="base").lower()
            elif self.stt_engine == "sphinx":
                return self.recognizer.recognize_sphinx(audio).lower()
            else:
                return self.recognizer.recognize_google(audio).lower()
        except (sr.UnknownValueError, sr.RequestError):
            return ""

    def speak(self, text):
        print(f"JARVIS: {text}")
        self.tts_queue.put(text)
        threading.Thread(target=self._process_tts, daemon=True).start()

    def _process_tts(self):
        while not self.tts_queue.empty():
            text = self.tts_queue.get()
            if self.tts_engine_type == "pyttsx3" and self.tts_engine:
                self.tts_engine.say(text)
                self.tts_engine.runAndWait()
            self.tts_queue.task_done()

    def listen_for_wake_word(self, wake_word, timeout=30):
        while True:
            with self.mic_lock:
                try:
                    with self.mic as source:
                        audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=3)
                    text = self.recognizer.recognize_google(audio).lower()
                    if wake_word in text:
                        return True
                except (sr.WaitTimeoutError, sr.UnknownValueError, sr.RequestError):
                    continue

    def cleanup(self):
        if self.tts_engine_type == "pyttsx3" and self.tts_engine:
            self.tts_engine.stop()
