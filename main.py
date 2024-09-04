import os
import telebot
from telebot.types import ChatPermissions

# Get the token from the environment variable
token = os.getenv('7292124945:AAE8cXZ4Tmk0ANW0RC6hI_R7IrWNZYVtpzQ')

# Initialize the bot with the token
bot = telebot.TeleBot(token)

# Define the list of referral link keywords
REFERRAL_KEYWORDS = ["ref","vt.tiktok.com", "joinchat", "invite", "t.me"]

# Function to mute the user
def mute_user(chat_id, user_id):
    bot.restrict_chat_member(chat_id, user_id, ChatPermissions(can_send_messages=False))
    bot.send_message(chat_id, f"စောက်ဝါးသား {user_id} လက်ယားမှုအတွက် Group ထဲကနေ ခွေးလို ကန်ထုတ်လ်ုက်ပြီ.")

# Handle the /start and /help commands
@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, "**မင်္ဂလာပါ ! စောက်တောသားများကို နှိမ်နင်းပေးနေတဲ့ သခင်ကြီးလာပါပြီဗျာ!**")

# Handle all other messages and mute if a referral link is detected
@bot.message_handler(func=lambda message: True)
def check_message(message):
    if any(keyword in message.text.lower() for keyword in REFERRAL_KEYWORDS):
        mute_user(message.chat.id, message.from_user.id)

# Start polling
bot.infinity_polling()
