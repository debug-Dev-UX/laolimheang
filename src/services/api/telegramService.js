// Telegram Service using Fetch API
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Send message to Telegram
export const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
};

// Format contact form message for Telegram
export const formatContactMessage = (data) => {
  const { name, email, subject, message } = data;
  const timestamp = new Date().toLocaleString();

  return `
<b>📨 New Contact Form Message</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Subject:</b> ${subject}

<b>Message:</b>
${message}

<b>Received:</b> ${timestamp}
  `.trim();
};

// Send contact form to Telegram
export const sendContactToTelegram = async (contactData) => {
  try {
    const message = formatContactMessage(contactData);
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending contact form to Telegram:', error);
    throw error;
  }
};

// Send notification to Telegram
export const sendNotification = async (title, text) => {
  try {
    const message = `<b>${title}</b>\n${text}`;
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Test Telegram connection
export const testTelegramConnection = async () => {
  try {
    const response = await fetch(`${TELEGRAM_API}/getMe`, {
      method: 'GET',
    });
    return await response.json();
  } catch (error) {
    console.error('Error testing Telegram connection:', error);
    throw error;
  }
};
