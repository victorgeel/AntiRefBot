const TELEGRAM_API = 'https://api.telegram.org/bot';
const BOT_TOKEN = '7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ'; // Your bot token
const WEBHOOK_URL = 'https://bot.geek79437.workers.dev/'; // Your provided webhook URL
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"];

// Function to set the webhook URL
async function setWebhook() {
    const webhookUrl = `${TELEGRAM_API}${BOT_TOKEN}/setWebhook`;

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: WEBHOOK_URL
        })
    });

    const result = await response.json();
    if (result.ok) {
        console.log('Webhook set successfully:', result);
    } else {
        console.error('Failed to set webhook:', result);
    }
}

// Function to mute the user
async function muteUser(chatId, userId) {
    const muteUrl = `${TELEGRAM_API}${BOT_TOKEN}/restrictChatMember`;

    const permissions = {
        can_send_messages: false,
    };

    await fetch(muteUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            user_id: userId,
            permissions: permissions
        })
    });

    // Send the notification message to the chat
    await sendMessage(chatId, `စောက်ဝာာသား ${userId} လက်ယားမှုအတွက် Group ထဲကနေ ခွေးလို ကန်ထုတ်လ်ုက်ပြီ.`);
}

// Function to send a message via Telegram
async function sendMessage(chatId, text) {
    const sendMessageUrl = `${TELEGRAM_API}${BOT_TOKEN}/sendMessage`;

    await fetch(sendMessageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
        })
    });
}

// Function to handle incoming messages
async function handleMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text;

    // Check if the message contains a referral keyword
    if (REFERRAL_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword))) {
        await muteUser(chatId, userId);
    } else if (text === '/start' || text === '/help') {
        await sendMessage(chatId, "**မင်္ဂလာပါ ! စောက်တောသားများကို နှိမ်နင်းပေးနေတဲ့ သခင်ကြီးလာပါပြီဗျာ!**");
    }
}

// Function to handle incoming webhook requests from Telegram
async function handleRequest(request) {
    try {
        const update = await request.json();

        // Check if the update contains a message
        if (update.message) {
            await handleMessage(update.message);
        }

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('Failed to process request', error);
        return new Response('Invalid request', { status: 400 });
    }
}

// Main entry point for the Cloudflare Worker
addEventListener('fetch', event => {
    event.respondWith((async () => {
        await setWebhook(); // Set webhook once during first request
        return handleRequest(event.request);
    })());
});
