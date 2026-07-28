// src/services/telegramService.js
// Sends contact form notifications to a Telegram bot

const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

/**
 * Send a formatted message to Telegram
 */
export const sendTelegramNotification = async ({ name, email, subject, message }) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram config missing — skipping notification.");
    return { success: false, error: "Telegram not configured." };
  }

  const text = `
🔔 *New Contact Message*

👤 *Name:* ${escapeMarkdown(name)}
📧 *Email:* ${escapeMarkdown(email)}
📋 *Subject:* ${escapeMarkdown(subject)}

💬 *Message:*
${escapeMarkdown(message)}

---
_Received via LaolimHeang Portfolio_
`.trim();

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true, error: null };
    } else {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error("sendTelegramNotification:", error);
    return { success: false, error: "Network error sending notification." };
  }
};

/**
 * Escape Telegram Markdown special characters
 */
function escapeMarkdown(text) {
  if (!text) return "";
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "$1");
}