import requests
import json

class SmartHome:
    def __init__(self, hub_url="", api_key=""):
        self.hub_url = hub_url
        self.api_key = api_key
        self.devices = {}

    def discover(self):
        return ["No smart home hub configured. Set HUB_URL in config to enable."]

    def control(self, device, command, value=""):
        if not self.hub_url:
            return f"Smart home not configured. Would {command} {device}" + (f" to {value}" if value else "")

        payload = {"device": device, "command": command}
        if value:
            payload["value"] = value
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            resp = requests.post(
                f"{self.hub_url}/api/device",
                json=payload,
                headers=headers,
                timeout=5
            )
            if resp.status_code == 200:
                return f"{device} turned {command}" + (f" to {value}" if value else "")
            return f"Smart home command failed: {resp.text}"
        except requests.RequestException as e:
            return f"Smart home error: {str(e)}"
