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

// Function to ban the user
async function banUser(chatId, userId) {
    const banUrl = `${TELEGRAM_API}${BOT_TOKEN}/kickChatMember`;

    await fetch(banUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            user_id: userId, // Use userId instead of username
            until_date: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 // Ban for 1 year
        })
    });

    // Send the notification message to the chat
    await sendMessage(chatId, `User with ID ${userId} has been banned for sending referral links.`);
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
            parse_mode: 'Markdown'
        })
    });
}

// Function to handle new member joining the chat
async function handleNewMembers(chatId, newMembers) {
    newMembers.forEach(async member => {
        const username = member.username || member.first_name; // Use username if available, else first name
        await sendMessage(chatId, `Welcome @${username} to the group!`);
    });
}

// Handle bot commands
async function handleCommand(command, chatId) {
    switch (command.trim()) { // Trim command to avoid issues with trailing spaces
        case '/start':
            await sendMessage(chatId, '**Hello! The bot is ready to manage this group!**');
            break;
        case '/help':
            await sendMessage(chatId, `**Help Menu**\n\nAvailable Commands:\n\nPsiphon termux cmd: \n\`\`\`/psi\`\`\`\n\nFree VPN Config tool: \n\`\`\`/freecfg\`\`\`\n\nBug & SNI Finder tool: \n\`\`\`/bugsni\`\`\`\n\nX-ray V2RAY Subscription Update Links: \n\`\`\`/sub\`\`\`\n\nSubdomain & Port Scanner: \n\`\`\`/subpt\`\`\``);
            break;
        case '/subpt':
            await sendMessage(chatId, `**Subdomain and Port Scanner Instructions**\n\n*Update Your Termux Pkg*\n\`\`\`python\npkg update\npkg upgrade\`\`\`\n\nClone Repo\n\`\`\`Git\ngit clone https://github.com/victorgeel/SubFinder.git\`\`\`\n\nRun Subfinder\n\`\`\`python\npython Run.py\`\`\`\n\nRun Port Scanner\n\`\`\`python\npython portscan.py\`\`\``);
            break;
        case '/bugsni':
            await sendMessage(chatId, `**Bug & SNI Finder Tool**\n\n\`\`\`python\npkg update && pkg upgrade -y\npkg install golang\`\`\`\n\nClone the repo\n\`\`\`python\ngit clone https://github.com/victorgeel/Sub-BugSNI.git\ncd Sub-BugSNI\nchmod +x *\`\`\`\n\nInstall requirements\n\`\`\`python\npip3 install -r requirements.txt\`\`\`\n\nRun the tool\n\`\`\`python\npython run.py\`\`\``);
            break;
        case '/psi':
            await sendMessage(chatId, `**Psiphon Pro for Android Termux**\n\`\`\`python\npkg update\npkg upgrade -y\npkg install git\npkg install golang\`\`\`\n\nClone the repo\n\`\`\`python\ngit clone https://github.com/victorgeel/Yes.git\ncd Yes\nchmod +x *\`\`\`\n\nRun Psiphon\n\`\`\`./yes\`\`\`\n\nSocks proxy settings\n\`\`\`socks\n127.0.0.1:3080\`\`\``);
            break;
        case '/sub':
            await sendMessage(chatId, `**Subscription Update Links**\n\`\`\`URL\nhttps://mirror.ghproxy.com/https://raw.githubusercontent.com/peasoft/NoMoreWalls/master/list.txt\n\nhttps://raw.githubusercontent.com/Surfboardv2ray/TGParse/main/splitted/vmess\n\nhttps://raw.githubusercontent.com/soroushmirzaei/telegram-configs-collector/main/protocols/shadowsocks\n\nhttps://github.com/barry-far/V2ray-Configs/raw/main/Splitted-By-Protocol/trojan.txt\n\nhttps://raw.githubusercontent.com/MhdiTaheri/V2rayCollector/main/sub/vmessbase64\n\nhttps://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/vless\n\nhttps://raw.githubusercontent.com/ts-sf/fly/main/v2\n\nhttps://mirror.v2gh.com/https://raw.githubusercontent.com/ts-sf/fly/main/v2\n\nhttps://raw.githubusercontent.com/Surfboardv2ray/v2ray-worker-sub/master/Eternity\`\`\``);
            break;
        case '/freecfg':
            await sendMessage(chatId, `**Free VPN Config Tool**\n\n*Update Termux Pkg*\n\`\`\`shell\npkg update\npkg upgrade\`\`\`\n\nClone Repo\n\`\`\`shell\ngit clone https://github.com/victorgeel/FreeVpn.git\ncd FreeVpn\`\`\`\n\nRun Tool\n\`\`\`Shell\nbash Sel.sh\`\`\`\n\n•Enter 99 to install the script. Follow further steps as prompted.`);
            break;
        default:
            await sendMessage(chatId, "Unknown command. Please use /help to see the available commands.");
    }
}

// Function to handle incoming messages
async function handleMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id; // Get the user ID
    const username = message.from.username || message.from.first_name;

    // Check if the message is a bot command
    if (message.text.startsWith('/')) {
        await handleCommand(message.text, chatId);
    } else if (REFERRAL_KEYWORDS.some(keyword => message.text.toLowerCase().includes(keyword))) {
        await banUser(chatId, userId); // Use userId to ban the user
    }
}

// Function to handle incoming webhook requests from Telegram
async function handleRequest(request) {
    try {
        const update = await request.json();

        // Check if new members joined the chat
        if (update.message && update.message.new_chat_members) {
            await handleNewMembers(update.message.chat.id, update.message.new_chat_members);
        }

        // Check if the update contains a message
        if (update.message && update.message.text) {
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
