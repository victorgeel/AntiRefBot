addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Use the Cloudflare Worker environment variable for the TOKEN
const TOKEN = TOKEN_ENV; // TOKEN_ENV should be the environment variable set in Cloudflare
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;
const REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "claim", "airdrop", "t.me"];
const SAFE_COMMANDS = ["/help", "/bugsni", "/psi", "/freecfg", "/sublink"]; // Added /sublink to safe commands

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
    text: `စောက်တောသား ${userId} ကို လက်ယားမှုအတွက် Group ထဲကနေ ခွေးလို ကန်ထုတ်လိုက်ပါပြီ‌ဗျို..! အဆင်ပြေရင်လက်ခုတ်သံလေးတွေ ကြားချင်ပါတယ် 😅😅😅`
  });
}

async function handleCommand(message) {
  const chatId = message.chat.id;
  const messageText = message.text;

  if (messageText.startsWith('/help')) {
    const helpMessage = `/psi\nPsiphon termux cmd ယူရန်....\n\n/freecfg\nFree Vpn Config များအတွက် termux tool cmd ရယူရန်....\n\n/bugsni\nBug နှင့် Sni ရှာနိုင်တဲ့ termux tool cmd ရယူရန်....\n\n/sublink\nဖရီး Subscription link update ရယူရန်....`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: helpMessage
    });
  } else if (messageText.startsWith('/psi')) {
    const psiMessage = `**•Psiphon pro for Android Termux•**\n\n\`\`\`python\npkg update\n\npkg upgrade -y\n\npkg install git\n\npkg install golang\n\ngit clone https://github.com/victorgeel/Yes.git\n\ncd Yes\n\nchmod +x *\n\n./yes\`\`\`\n\n**Socks proxy 127.0.0.1:3080**`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: psiMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/freecfg')) {
    const freecfgMessage = `**•Free Vpn Config ယူရန် cmd•**\n\n\`\`\`python\npkg update \n\npkg upgrade\n\ngit clone https://github.com/victorgeel/FreeVpn.git\n\ncd FreeVpn\n\nbash Sel.sh\`\`\`\n\n**•နံပါတ် 99 ရိုက်ပြီး script Install ပါ။**\n**•ကျန်အဆင့်များကို နံပါတ်စဉ်အတိုင်းဖတ်ပြီးဆက်လက်လုပ်ဆောင်ပါ။**`;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: freecfgMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/bugsni')) {
    const bugsniMessage = `**•Bug Sni Finder အတွက် cmd•**\n\n\`\`\`python\npkg update && pkg upgrade -y\n\npkg install golang\n\n\ngit clone https://github.com/victorgeel/Sub-BugSNI.git\n\ncd Sub-BugSNI\n\nchmod +x *\n\npip3 install -r requirements.txt\n\npython3 run.py\`\`\``;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: bugsniMessage,
      parse_mode: 'Markdown'
    });
  } else if (messageText.startsWith('/sublink')) {
    const sublinkMessage = `**•Subscription Update Links•**\n\n\`\`\`Link\nhttps://mirror.ghproxy.com/https://raw.githubusercontent.com/peasoft/NoMoreWalls/master/list.txt\n\nhttps://raw.githubusercontent.com/Surfboardv2ray/TGParse/main/splitted/vmess\n\nhttps://raw.githubusercontent.com/soroushmirzaei/telegram-configs-collector/main/protocols/shadowsocks\n\nhttps://github.com/barry-far/V2ray-Configs/raw/main/Splitted-By-Protocol/trojan.txt\n\nhttps://raw.githubusercontent.com/MhdiTaheri/V2rayCollector/main/sub/vmessbase64\n\nhttps://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/vless\n\nhttps://raw.githubusercontent.com/ts-sf/fly/main/v2\n\nhttps://mirror.v2gh.com/https://raw.githubusercontent.com/ts-sf/fly/main/v2\n\nhttps://raw.githubusercontent.com/Surfboardv2ray/v2ray-worker-sub/master/Eternity\`\`\``;
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: sublinkMessage,
      parse_mode: 'Markdown'
    });
  } else {
    const welcomeMessage = "မင်္ဂလာပါ ! တောသားတွေ ဂျင်းကောင်တွေကို နှိမ်နင်းပေးတဲ့ သခင်ကြီးပါ ! 🩵Fastssh Myanmar Group က ကြိုဆိုပါတယ်💙 !";
    await callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: welcomeMessage
    });
  }
}

async function checkMessage(message) {
  const messageText = message.text.toLowerCase();

  // Check if the message starts with one of the safe commands
  const isSafeCommand = SAFE_COMMANDS.some(command => messageText.startsWith(command));

  // If the message contains a referral keyword and is not a safe command, mute the user
  if (!isSafeCommand && REFERRAL_KEYWORDS.some(keyword => messageText.includes(keyword))) {
    await muteUser(message.chat.id, message.from.id);
  }
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    try {
      const { message } = await request.json();
      if (message && message.chat && message.from) {
        if (message.text) {
          await handleCommand(message);
          await checkMessage(message);
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
