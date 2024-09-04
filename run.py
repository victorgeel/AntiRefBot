from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

# Replace 'YOUR_TOKEN_HERE' with your actual bot token
TOKEN = 'YOUR_TOKEN_HERE'

# Keywords to identify referral links (add more as needed)
REFERRAL_KEYWORDS = ['ref', 'referral', 'join', 'discount']

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Hi! I am your moderation bot.')

def block_referrals(update: Update, context: CallbackContext) -> None:
    # Check if message contains a referral link
    message_text = update.message.text.lower()
    if any(keyword in message_text for keyword in REFERRAL_KEYWORDS):
        # Automatically ban the user
        context.bot.kick_chat_member(update.message.chat.id, update.message.from_user.id)
        update.message.reply_text(f'User {update.message.from_user.username} has been banned for sending referral links.')
    else:
        update.message.reply_text('Message received.')

def main() -> None:
    # Set up the Updater
    updater = Updater(TOKEN)
    dispatcher = updater.dispatcher

    # Add command handler to start bot
    dispatcher.add_handler(CommandHandler("start", start))

    # Add message handler to block referrals
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, block_referrals))

    # Start the Bot
    updater.start_polling()

    # Run the bot until you send a stop signal
    updater.idle()

if __name__ == '__main__':
    main()
