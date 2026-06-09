import requests
import json

class WebSearch:
    def search(self, query):
        try:
            url = f"https://api.duckduckgo.com/?q={query}&format=json&no_html=1"
            resp = requests.get(url, timeout=10)
            data = resp.json()
            if data.get("AbstractText"):
                return data["AbstractText"][:500]
            if data.get("RelatedTopics"):
                for topic in data["RelatedTopics"]:
                    if isinstance(topic, dict) and "Text" in topic:
                        return topic["Text"][:500]
            return f"Search results for '{query}' - check browser for details"
        except Exception as e:
            return f"Search failed: {str(e)}"

    def get_weather(self, location="New York"):
        try:
            resp = requests.get(
                f"https://wttr.in/{location}?format=%l:+%C+%t+%w+%h",
                timeout=10
            )
            if resp.status_code == 200:
                return f"Weather in {resp.text}"
            return f"Could not get weather for {location}"
        except Exception as e:
            return f"Weather error: {str(e)}"

    def get_news(self, topic="general"):
        try:
            resp = requests.get(
                f"https://newsapi.org/v2/top-headlines?q={topic}&pageSize=5&apiKey=demo",
                timeout=10
            )
            data = resp.json()
            if data.get("articles"):
                headlines = [a["title"] for a in data["articles"][:5]]
                return "Top headlines: " + " | ".join(headlines)
            return f"Searching news for {topic}"
        except Exception as e:
            return f"Could not fetch news: {str(e)}"
