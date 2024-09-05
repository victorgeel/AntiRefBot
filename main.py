import telebot
from telebot.types import ChatPermissions

# Initialize the bot with your token
bot = telebot.TeleBot("7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ")

# Remove any existing webhooks
bot.remove_webhook()

# Define the list of referral link keywords
REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"]

# Function to mute the user
def mute_user(chat_id, user_id):
    bot.restrict_chat_member(chat_id, user_id, ChatPermissions(can_send_messages=False))
    bot.send_message(chat_id, f"စောက်ဝာာသား {user_id} လက်ယားမှုအတွက် Group ထဲကနေ ခွေးလို ကန်ထုတ်လ်ုက်ပြီ.")

# Handle the /start and /help commands
@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, "**မင်္ဂလာပါ ! စောက်တောသားများကို နှိမ်နင်းပေးနေတဲ့ သခင်ကြီးလာပါပြီဗျာ!**")

# Handle all other messages and mute if a referral link is detected
@bot.message_handler(func=lambda message: True)
def check_message(message):
    if any(keyword in message.text.lower() for keyword in REFERRAL_KEYWORDS):
        mute_user(message.chat.id, message.from_user.id)

# Start polling for messages
bot.polling()
