addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Use the provided Telegram bot token directly
const TOKEN = '7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ'; 
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "claim", "airdrop", "t.me"];
const SAFE_COMMANDS = ["/help", "/bugsni", "/psi", "/freecfg", "/sublink"]; // Safe commands

async function callTelegramApi(method, body) {
  const url = `${TELEGRAM_API_URL}/${method}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  
  try {
    const response = await fetch(url, options);
    const responseBody = await response.json();
    if (!response.ok) {
      console.error(`Error calling Telegram API (${method}): ${responseBody.description}`);
    }
    return response;
  } catch (error) {
    console.error('Error with Telegram API request:', error);
  }
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
    text: `User ${userId} has been muted due to violating the group rules.`
  });
}

async function handleCommand(message) {
  const chatId = message.chat.id;
  const messageText = message.text;

  if (messageText.startsWith('/help')) {
    const helpMessage = `/psi - Get Psiphon termux cmd\n/freecfg - Get free VPN config termux tool\n/bugsni - Bug & SNI termux tool\n/sublink - Get free subscription link updates`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: helpMessage
    });
  } else if (messageText.startsWith('/psi')) {
    const psiMessage = `**Psiphon Pro for Android (Termux)**\n\`\`\`bash\npkg update && pkg upgrade\npkg install git golang\n\ngit clone https://github.com/victorgeel/Yes.git\ncd Yes\nchmod +x *\n./yes\`\`\`\n**Socks proxy: 127.0.0.1:3080**`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: psiMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/freecfg')) {
    const freecfgMessage = `**Free VPN Config (Termux)**\n\`\`\`bash\npkg update && pkg upgrade\n\ngit clone https://github.com/victorgeel/FreeVpn.git\ncd FreeVpn\nbash Sel.sh\n\`\`\`\nEnter number 99 to proceed.`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: freecfgMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/bugsni')) {
    const bugsniMessage = `**Bug & SNI Finder (Termux)**\n\`\`\`bash\npkg update && pkg upgrade\npkg install git golang\n\ngit clone https://github.com/victorgeel/Sub-BugSNI.git\ncd Sub-BugSNI\nchmod +x *\npip3 install -r requirements.txt\npython3 run.py\n\`\`\``;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: bugsniMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/sublink')) {
    const sublinkMessage = `**Subscription Links**\n- https://raw.githubusercontent.com/...`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: sublinkMessage,
      parse_mode: 'Markdown'
    });
  } else {
    const welcomeMessage = "Welcome to Fastssh Myanmar Group!";
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: welcomeMessage
    });
  }
}

async function checkMessage(message) {
  const messageText = message.text.toLowerCase();
  const isSafeCommand = SAFE_COMMANDS.some(command => messageText.startsWith(command));

  if (!isSafeCommand && REFERRAL_KEYWORDS.some(keyword => messageText.includes(keyword))) {
    await muteUser(message.chat.id, message.from.id);
  }
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    try {
      const { message } = await request.json();
      if (message && message.chat && message.from && message.text) {
        await handleCommand(message);
        await checkMessage(message);
      }
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Error', { status: 500 });
    }
  }
  return new Response('Invalid request', { status: 400 });
    }
