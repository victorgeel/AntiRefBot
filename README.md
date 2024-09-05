
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
 
REFERRAL_KEYWORDS = ["ref", "joinchat", "invite", "t.me"]


## ___________________

### Run the Code in ColabWhen you run this code, you should see the following:A public ngrok URL in the Colab output (something like http://<ngrok-id>.ngrok.io).The Flask app will be running at this public URL, and it will respond with "Bot is running!" when accessed.

### : Use the Public URL with UptimeRobotCopy the ngrok public URL from the Colab output.Go to your UptimeRobot dashboard.Set up a new HTTP monitor using the ngrok URL (e.g., http://<ngrok-id>.ngrok.io/).UptimeRobot will ping this URL to keep your Colab notebook active.Now your bot should stay alive, and you'll be able to use the ngrok public URL for monitoring and uptime checks.

### To use your own ngrok token in Google Colab and get a public URL for your Flask app, follow these steps:

### Step 1: Get Your ngrok TokenGo to the ngrok website and sign up for an account.After signing up, go to the Dashboard and copy your Auth Token from the "Your Authtoken" section.Step 

### 2: Install and Set Up ngrok in ColabIn Colab, you can install ngrok and authenticate using your token to ensure that you get a persistent public URL.Step 3: Modify the Colab Code to Use ngrok with the Token

## Set up the Telegram bot

API_KEY = '7292124945:AAE8cXZ4Tmk0AN

## Set up Ngrok auth Token 

ngrok.set_auth_token("2ldPp0d7xqgKxgdsGGTxbEIHQCp_DA1185oAmS5v4fWMmCtH")
