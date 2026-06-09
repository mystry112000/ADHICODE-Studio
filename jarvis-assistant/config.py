import os
from dotenv import load_dotenv

load_dotenv()

WAKE_WORD = os.getenv("WAKE_WORD", "jarvis")
STT_ENGINE = os.getenv("STT_ENGINE", "google")
TTS_ENGINE = os.getenv("TTS_ENGINE", "pyttsx3")
AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
AI_MODEL = os.getenv("AI_MODEL", "llama3.2")
AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.7"))
AI_MAX_TOKENS = int(os.getenv("AI_MAX_TOKENS", "1024"))
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
MIC_INDEX = int(os.getenv("MIC_INDEX", "0"))
ENERGY_THRESHOLD = int(os.getenv("ENERGY_THRESHOLD", "3000"))
PHRASE_TIME_LIMIT = float(os.getenv("PHRASE_TIME_LIMIT", "10.0"))
BUN_HOST = os.getenv("BUN_HOST", "127.0.0.1")
BUN_PORT = int(os.getenv("BUN_PORT", "4876"))
BUN_SECRET = os.getenv("BUN_SECRET", "jarvis-local")
