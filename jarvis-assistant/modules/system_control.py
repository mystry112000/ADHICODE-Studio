import os
import subprocess
import platform
import psutil
from datetime import datetime

class SystemControl:
    def __init__(self):
        self.os_name = platform.system()

    def open_app(self, name):
        name = name.lower()
        apps = {
            "chrome": ("chrome", "google-chrome", "start chrome"),
            "browser": ("chrome", "google-chrome", "start chrome"),
            "notepad": ("notepad", "gedit", "notepad"),
            "calculator": ("calc", "gnome-calculator", "calc"),
            "explorer": ("explorer", "nautilus", "explorer"),
            "terminal": ("cmd", "gnome-terminal", "cmd"),
            "vscode": ("code", "code", "code"),
            "spotify": ("spotify", "spotify", "start spotify"),
        }
        app_cmd = apps.get(name, (name, name, name))

        try:
            if self.os_name == "Windows":
                idx = 2 if len(app_cmd) > 2 else 0
                os.system(app_cmd[idx] if " " not in app_cmd[idx] else f'start "" "{name}"')
            elif self.os_name == "Darwin":
                subprocess.Popen(["open", "-a", app_cmd[0]])
            else:
                subprocess.Popen(app_cmd[1])
            return f"Opened {name}"
        except Exception as e:
            return f"Could not open {name}: {str(e)}"

    def close_app(self, name):
        try:
            if self.os_name == "Windows":
                subprocess.run(["taskkill", "/f", "/im", f"{name}.exe"], capture_output=True)
            else:
                subprocess.run(["pkill", "-f", name], capture_output=True)
            return f"Closed {name}"
        except Exception as e:
            return f"Could not close {name}: {str(e)}"

    def run_command(self, command):
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
            output = result.stdout or result.stderr
            return output[:500] if output else "Command executed"
        except subprocess.TimeoutExpired:
            return "Command timed out"
        except Exception as e:
            return f"Command error: {str(e)}"

    def take_screenshot(self):
        try:
            import pyautogui
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"screenshot_{timestamp}.png"
            pyautogui.screenshot(filename)
            return f"Screenshot saved as {filename}"
        except ImportError:
            return "pyautogui not installed"
        except Exception as e:
            return f"Screenshot error: {str(e)}"

    def get_current_time(self):
        now = datetime.now()
        return f"It's {now.strftime('%I:%M %p')} on {now.strftime('%A, %B %d, %Y')}"

    def get_system_info(self):
        cpu = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        return (
            f"CPU: {cpu}% | RAM: {memory.percent}% used ({memory.used // (1024**3)}GB/{memory.total // (1024**3)}GB) | "
            f"Disk: {disk.percent}% used | Booted: {boot_time.strftime('%I:%M %p')}"
        )
