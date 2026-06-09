export async function searchWeb(query: string): Promise<string> {
  try {
    const resp = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
    const data: any = await resp.json();
    if (data.AbstractText) return data.AbstractText.slice(0, 500);
    if (data.RelatedTopics?.length) {
      for (const topic of data.RelatedTopics) {
        if (topic.Text) return topic.Text.slice(0, 500);
      }
    }
    return `Search results for '${query}'`;
  } catch (e) {
    return `Search failed: ${e}`;
  }
}

export async function getWeather(location = "New York"): Promise<string> {
  try {
    const resp = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=%l:+%C+%t+%w+%h`);
    if (resp.ok) {
      const text = await resp.text();
      return `Weather in ${text}`;
    }
    return `Could not get weather for ${location}`;
  } catch (e) {
    return `Weather error: ${e}`;
  }
}

export async function getNews(topic = "general"): Promise<string> {
  try {
    const resp = await fetch(`https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(topic)}&pageSize=5&apiKey=demo`);
    const data: any = await resp.json();
    if (data.articles?.length) {
      const headlines = data.articles.slice(0, 5).map((a: any) => a.title);
      return "Top headlines: " + headlines.join(" | ");
    }
    return `Searching news for ${topic}`;
  } catch {
    return `Could not fetch news`;
  }
}
