
# My Telegram Bot

This bot mutes users who send referral links in a Telegram group.

## Installation

1. Clone the repository
2. ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository
  
  
  !Install the required dependencie

pip install -r requirements.txt

Or

manually install the required package:pip install pyTelegramBotAPIRun the bot:python main.py
pip install pyTelegramBotAPI

Run the bot

python main.py

# AntiRefBot

This project creates a bot that blocks anyone who sends a referral link to your Telegram group!

## Important Notes

- Replace `"YOUR_BOT_TOKEN_HERE"` with your actual Telegram bot token in the script.
  
  Example:
   ```python
  bot = telebot.TeleBot("XXX:xxxx")

 You can add or modify the keywords in the REFERRAL_KEYWORDS list to match the types of links you want to mute.Example:

 ```python
REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"]
