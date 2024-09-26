const TELEGRAM_BOT_TOKEN = "7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"];

async function muteUser(chatId, userId) {
    const permissions = {
        can_send_messages: false,
    };
    const url = `${TELEGRAM_API_URL}/restrictChatMember?chat_id=${chatId}&user_id=${userId}&permissions=${JSON.stringify(permissions)}`;
    await fetch(url);
    await sendMessage(chatId, `User ${userId} has been muted for violating rules.`);
}

async function sendMessage(chatId, text) {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "Markdown",
        }),
    });
    return response.json();
}

async function handleUpdate(update) {
    if (update.message) {
        const message = update.message;
        const chatId = message.chat.id;
        const userId = message.from.id;

        // Handle /start and /help commands
        if (message.text === '/start' || message.text === '/help') {
            await sendMessage(chatId, "**Welcome! The bot is here to manage group rules!**");
        } else {
            // Check for referral keywords in the message
            const messageText = message.text.toLowerCase();
            if (REFERRAL_KEYWORDS.some(keyword => messageText.includes(keyword))) {
                await muteUser(chatId, userId);
            }
        }
    }
}

async function handleRequest(request) {
    let update;
    try {
        update = await request.json();
    } catch (error) {
        // Handle the case where JSON parsing fails
        console.error("Failed to parse JSON:", error);
        return new Response('Invalid JSON input', { status: 400 });
    }

    // If valid JSON, process the update
    if (update) {
        await handleUpdate(update);
    }
    
    return new Response('OK', { status: 200 });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
