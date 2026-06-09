import threading
import time
from config import WAKE_WORD, STT_ENGINE, TTS_ENGINE
from core.voice import VoiceEngine
from core.brain import AIBrain
from gui import JarvisGUI

class Jarvis:
    def __init__(self):
        self.voice = VoiceEngine(stt_engine=STT_ENGINE, tts_engine=TTS_ENGINE)
        self.brain = AIBrain()
        self.running = True
        self.wake_word = WAKE_WORD.lower()
        self.gui = JarvisGUI()
        self.gui.on_test = self._test_system

    def run(self):
        self._testing = False
        self.gui.add_message("jarvis", "JARVIS initializing...")
        if self.brain.available:
            self.gui.add_message("jarvis", "Bun brain: CONNECTED")
            print("[JARVIS] Bun brain: CONNECTED")
        else:
            self.gui.add_message("jarvis", "Bun brain: OFFLINE - start bun run server.ts")
            print("[JARVIS] Bun brain: OFFLINE - start bun run server.ts in another terminal")

        print("[JARVIS] Say 'jarvis' to wake me | Press T in GUI to test | Right-click GUI to exit")
        self.gui.add_message("jarvis", f"Online. Say '{self.wake_word}' to wake me.")
        self.voice.speak("Hello sir, JARVIS at your service.")

        threading.Thread(target=self._voice_loop, daemon=True).start()
        self.gui.run()

    def _test_system(self):
        if self._testing:
            return
        self._testing = True
        try:
            print("[TEST] Running system diagnostics...")
            self.gui.add_message("jarvis", "[DIAG] Testing Bun...")
            ok = self.brain.available
            print(f"[TEST] Bun brain: {'CONNECTED' if ok else 'OFFLINE'}")
            self.gui.add_message("jarvis", f"[DIAG] Bun: {'OK' if ok else 'OFFLINE'}")

            print("[TEST] Testing microphone...")
            self.gui.add_message("jarvis", "[DIAG] Testing mic (speak now)...")
            self.gui.set_state("listening")
            try:
                result = self.voice.listen(phrase_limit=3)
                if result:
                    print(f"[TEST] Mic heard: '{result}'")
                    self.gui.add_message("jarvis", f"[DIAG] Mic OK - heard: '{result[:30]}'")
                else:
                    print("[TEST] Mic: no speech detected")
                    self.gui.add_message("jarvis", "[DIAG] Mic: no speech detected")
            except Exception as e:
                print(f"[TEST] Mic error: {e}")
                self.gui.add_message("jarvis", f"[DIAG] Mic ERROR: {e}")
            self.gui.set_state("idle")

            if ok:
                print("[TEST] Sending test message to Bun...")
                resp = self.brain.process("say 'system test passed' in three words")
                print(f"[TEST] Bun response: {resp}")
                self.gui.add_message("jarvis", f"[DIAG] AI: '{resp[:40]}'")
                self.voice.speak(resp)
        finally:
            self._testing = False

    def _voice_loop(self):
        while self.running:
            self.gui.set_state("idle")
            print("[JARVIS] Waiting for wake word...")
            found = self.voice.listen_for_wake_word(self.wake_word)
            if not found:
                continue

            print("[JARVIS] Wake word detected!")
            self.gui.set_state("listening")
            self.gui.add_message("jarvis", "Listening...")
            self.voice.speak("Listening...")
            command = self.voice.listen(phrase_limit=10)

            if not command:
                print("[JARVIS] No command heard")
                self.gui.set_state("idle")
                continue

            print(f"[YOU] {command}")
            self.gui.add_message("you", command)

            cmd = command.lower().strip()
            if cmd in ["exit", "quit", "goodbye", "shutdown"]:
                self.voice.speak("Shutting down. Goodbye sir.")
                self.gui.add_message("jarvis", "Shutting down.")
                self.running = False
                self.gui.stop()
                break

            if cmd in ["clear", "reset"]:
                self.brain.clear_history()
                self.voice.speak("Memory cleared.")
                self.gui.add_message("jarvis", "Memory cleared.")
                continue

            self.gui.set_state("thinking")
            print("[JARVIS] Processing...")
            response = self.brain.process(command)
            print(f"[JARVIS] {response[:100]}")

            self.gui.set_state("speaking")
            self.voice.speak(response)
            self.gui.add_message("jarvis", response[:100])
            self.gui.set_state("idle")

    def cleanup(self):
        self.voice.cleanup()

def main():
    jarvis = Jarvis()
    try:
        jarvis.run()
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        jarvis.cleanup()

if __name__ == "__main__":
    main()
