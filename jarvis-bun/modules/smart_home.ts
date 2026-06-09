const HUB_URL = process.env.HUB_URL || "";
const HUB_KEY = process.env.HUB_KEY || "";

export async function controlDevice(device: string, command: string, value = ""): Promise<string> {
  if (!HUB_URL) {
    return value
      ? `Would set ${device} ${command} to ${value}`
      : `Would turn ${device} ${command}`;
  }
  try {
    const resp = await fetch(`${HUB_URL}/api/device`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(HUB_KEY ? { Authorization: `Bearer ${HUB_KEY}` } : {}) },
      body: JSON.stringify({ device, command, ...(value ? { value } : {}) }),
    });
    if (resp.ok) {
      return value
        ? `${device} set ${command} to ${value}`
        : `${device} turned ${command}`;
    }
    return `Smart home command failed: ${await resp.text()}`;
  } catch (e) {
    return `Smart home error: ${e}`;
  }
}
