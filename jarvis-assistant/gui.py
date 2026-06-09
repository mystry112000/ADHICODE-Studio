import tkinter as tk
import threading
import math
import time

THEME_BG = "#0a0a0f"
THEME_FG = "#00d4ff"
THEME_ACCENT = "#0088ff"
THEME_GLOW = "#00aaff"
THEME_TEXT = "#e0e0e0"

class JarvisGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("JARVIS")
        self.root.configure(bg=THEME_BG)
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)

        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        w, h = 420, 520
        x = screen_w - w - 30
        y = screen_h - h - 80
        self.root.geometry(f"{w}x{h}+{x}+{y}")

        self.canvas = tk.Canvas(self.root, width=w, height=h, bg=THEME_BG, highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)

        self.state = "idle"
        self.pulse = 0
        self.angle = 0
        self.messages = []
        self.scroll_y = 0
        self.on_test = None

        self._draw_static()
        self._animate()

        self.root.bind("<Button-1>", self._start_move)
        self.root.bind("<B1-Motion>", self._on_move)
        self.root.bind("<Button-3>", lambda e: self.root.destroy())
        self.root.bind("t", lambda e: self.on_test() if self.on_test else None)

    def _start_move(self, e):
        self._drag_x = e.x
        self._drag_y = e.y

    def _on_move(self, e):
        x = self.root.winfo_x() + e.x - self._drag_x
        y = self.root.winfo_y() + e.y - self._drag_y
        self.root.geometry(f"+{x}+{y}")

    def _draw_static(self):
        cx, cy, r = 210, 180, 80
        self.canvas.create_text(210, 20, text="JARVIS", font=("Consolas", 18, "bold"), fill=THEME_FG, tag="title")

        grad_colors = ["#00d4ff", "#0088ff", "#004488", "#002244"]
        for i, c in enumerate(grad_colors):
            self.canvas.create_oval(cx - r - i*4, cy - r - i*4, cx + r + i*4, cy + r + i*4,
                                    outline="", fill=c, tag=f"glow{i}")
        self.canvas.create_oval(cx - r, cy - r, cx + r, cy + r,
                                outline=THEME_GLOW, width=2, fill=THEME_BG, tag="ring")
        self.canvas.create_oval(cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6,
                                outline="", fill="#0d1117", tag="inner")

        for angle in range(0, 360, 45):
            rad = math.radians(angle)
            x1 = cx + (r - 15) * math.cos(rad)
            y1 = cy + (r - 15) * math.sin(rad)
            x2 = cx + r * math.cos(rad)
            y2 = cy + r * math.sin(rad)
            self.canvas.create_line(x1, y1, x2, y2, fill=THEME_ACCENT, width=1, tag="dash")

        self.canvas.create_text(cx, cy, text="●", font=("Consolas", 32), fill=THEME_FG, tag="dot")
        self.canvas.create_text(cx, cy + 100, text="STANDING BY", font=("Consolas", 10),
                                fill="#446688", tag="status")

        self.canvas.create_rectangle(20, 330, 400, 500, outline="#1a2a3a", width=1, fill="#080810", tag="log_bg")
        self.canvas.create_text(30, 340, text="[LOG]  press T to test", font=("Consolas", 8), fill="#335577",
                                anchor="w", tag="log_header")

    def _animate(self):
        self.pulse += 0.08
        self.angle += 0.03
        cx, cy, r = 210, 180, 80

        if self.state == "listening":
            pulse_r = 2 + math.sin(self.pulse * 2) * 6
            glow_alpha = 0.3 + math.sin(self.pulse * 2) * 0.3
            dot_color = "#00ff88"
            status_text = "LISTENING..."
            status_color = "#00ff88"
        elif self.state == "speaking":
            pulse_r = 4 + math.sin(self.pulse * 3) * 8
            glow_alpha = 0.5 + math.sin(self.pulse * 3) * 0.4
            dot_color = "#ffaa00"
            status_text = "SPEAKING"
            status_color = "#ffaa00"
        elif self.state == "thinking":
            pulse_r = 1 + math.sin(self.pulse * 4) * 3
            glow_alpha = 0.2 + math.sin(self.pulse * 4) * 0.2
            dot_color = "#4488ff"
            status_text = "PROCESSING..."
            status_color = "#4488ff"
        else:
            pulse_r = 0.5 + math.sin(self.pulse * 0.5) * 1.5
            glow_alpha = 0.1 + math.sin(self.pulse * 0.5) * 0.1
            dot_color = THEME_FG
            status_text = "STANDING BY"
            status_color = "#446688"

        self.canvas.delete("pulse")
        for i in range(3):
            pr = r + pulse_r * (i + 1) * 2
            alpha = glow_alpha / (i + 1)
            self.canvas.create_oval(cx - pr, cy - pr, cx + pr, cy + pr,
                                    outline="", fill="", width=2,
                                    tag="pulse")

        arc_start = math.degrees(self.angle)
        arc_ext = 90 + math.sin(self.pulse) * 30
        self.canvas.delete("arc")
        self.canvas.create_arc(cx - r + 4, cy - r + 4, cx + r - 4, cy + r - 4,
                                start=arc_start, extent=arc_ext,
                                outline=dot_color, width=2, style="arc", tag="arc")

        self.canvas.itemconfig("dot", fill=dot_color)
        self.canvas.itemconfig("status", text=status_text, fill=status_color)

        self.root.after(50, self._animate)

    def set_state(self, state):
        self.state = state

    def add_message(self, role, text):
        self.messages.append((role, text))
        self._update_log()

    def _update_log(self):
        self.canvas.delete("log_text")
        y = 360
        for role, text in self.messages[-8:]:
            label = f"[{role.upper()}]"
            color = THEME_FG if role == "jarvis" else "#88aacc"
            display = f"{label} {text[:50]}{'...' if len(text) > 50 else ''}"
            self.canvas.create_text(30, y, text=display, font=("Consolas", 8),
                                    fill=color, anchor="w", tag="log_text")
            y += 16

    def run(self):
        self.root.mainloop()

    def stop(self):
        self.root.quit()
