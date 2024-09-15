addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const TOKEN = "7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"];

async function callTelegramApi(method, body) {
  const url = `${TELEGRAM_API_URL}/${method}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  const response = await fetch(url, options);
  
  // Log the response status and body for debugging
  const responseBody = await response.json();
  if (!response.ok) {
    console.error(`Error calling Telegram API (${method}): ${responseBody.description}`);
  }
  return response;
}

async function muteUser(chatId, userId) {
  const chatPermissions = { can_send_messages: false };
  await callTelegramApi('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: chatPermissions
  });

  await callTelegramApi('sendMessage', {
    chat_id: chatId,
    text: `User ${userId} has been muted for sending a message with prohibited content.`
  });
}

async function handleCommand(message) {
  const welcomeMessage = "Welcome! I am here to manage the group and enforce rules.";
  await callTelegramApi('sendMessage', {
    chat_id: message.chat.id,
    text: welcomeMessage
  });
}

async function checkMessage(message) {
  const messageText = message.text.toLowerCase();
  if (REFERRAL_KEYWORDS.some(keyword => messageText.includes(keyword))) {
    await muteUser(message.chat.id, message.from.id);
  }
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    try {
      const { message } = await request.json();
      if (message && message.chat && message.from) {
        if (message.text) {
          if (message.text.startsWith('/start') || message.text.startsWith(`/start@YourBotUsername`) ||
              message.text.startsWith('/help') || message.text.startsWith(`/help@YourBotUsername`)) {
            await handleCommand(message);
          } else {
            await checkMessage(message);
          }
        }
      }
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Error', { status: 500 });
    }
  }
  return new Response('Invalid request', { status: 400 });
}
