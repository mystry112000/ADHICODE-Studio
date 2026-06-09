import requests
from config import BUN_HOST, BUN_PORT, BUN_SECRET

BUN_URL = f"http://{BUN_HOST}:{BUN_PORT}/api/chat"
BUN_HEALTH = f"http://{BUN_HOST}:{BUN_PORT}/api/health"
HEADERS = {"Authorization": f"Bearer {BUN_SECRET}", "Content-Type": "application/json"}

class AIBrain:
    def __init__(self):
        self._last_available = None

    @property
    def available(self):
        if self._last_available is None:
            self._last_available = self._check_bun()
        return self._last_available

    def _check_bun(self):
        try:
            r = requests.get(BUN_HEALTH, headers={"Authorization": f"Bearer {BUN_SECRET}"}, timeout=3)
            return r.status_code == 200
        except requests.RequestException:
            return False

    def process(self, user_input):
        self._last_available = self._check_bun()

        if not self._last_available:
            return "Bun backend not running. Open a terminal and run: bun run C:\\Users\\ASUS\\JARVIS\\jarvis-bun\\server.ts"

        try:
            resp = requests.post(BUN_URL, headers=HEADERS, json={"message": user_input}, timeout=90)
            if resp.status_code == 200:
                data = resp.json()
                result = data.get("response", "")
                actions = data.get("actions", "")
                if actions:
                    result = result + "\n" + actions
                return result.strip()
            elif resp.status_code == 401:
                return "Authentication failed. Check BUN_SECRET in .env"
            else:
                return f"Bun error: {resp.status_code}"
        except requests.ConnectionError:
            self._last_available = False
            return "Cannot reach Bun backend. Make sure bun run server.ts is running in another terminal."
        except requests.Timeout:
            return "Bun backend timed out. The AI model may still be loading."
        except Exception as e:
            return f"Error: {str(e)}"

    def clear_history(self):
        try:
            requests.post(BUN_URL, headers=HEADERS, json={"message": "clear"}, timeout=5)
        except requests.RequestException:
            pass
