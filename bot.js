addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const TOKEN = "7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"];

// Utility function to call Telegram API
async function callTelegramApi(method, body) {
  const url = `${TELEGRAM_API_URL}/${method}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  return fetch(url, options);
}

// Function to mute the user
async function muteUser(chatId, userId) {
  const chatPermissions = { can_send_messages: false };
  await callTelegramApi('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions: chatPermissions
  });

  await callTelegramApi('sendMessage', {
    chat_id: chatId,
    text: `စောက်ဝာာသား ${userId} လက်ယားမှုအတွက် Group ထဲကနေ ခွေးလို ကန်ထုတ်လ်ုက်ပြီ.`
  });
}

// Handle the /start and /help commands
async function handleCommand(message) {
  const welcomeMessage = "**မင်္ဂလာပါ ! စောက်တောသားများကို နှိမ်နင်းပေးနေတဲ့ သခင်ကြီးလာပါပြီဗျာ!**";
  await callTelegramApi('sendMessage', {
    chat_id: message.chat.id,
    text: welcomeMessage
  });
}

// Handle incoming messages and check for referral links
async function checkMessage(message) {
  const messageText = message.text.toLowerCase();
  if (REFERRAL_KEYWORDS.some(keyword => messageText.includes(keyword))) {
    await muteUser(message.chat.id, message.from.id);
  }
}

// Main handler for incoming webhook requests
async function handleRequest(request) {
  if (request.method === 'POST') {
    const { message } = await request.json();

    if (message.text) {
      if (message.text.startsWith('/start') || message.text.startsWith('/help')) {
        await handleCommand(message);
      } else {
        await checkMessage(message);
      }
    }
    return new Response('OK', { status: 200 });
  }

  return new Response('Invalid request', { status: 400 });
               }
