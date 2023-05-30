# webhook-tradingview-bot
This Node.js app receives Webhook notifications from Tradingview and executes market buy/sell orders on Binance accordingly. The outcome is relayed to a Telegram Chat, displaying the Tradingview alert, the action taken by Binance, and the speed of order execution from the moment the signal was received.

The bot is built using the node-binance-api library, which provides a simple and easy-to-use API for interacting with the Binance exchange.

It also makes use of the node-telegram-bot-api library, which provides a simple and easy-to-use API for interacting with Telegram.


Getting Started

To get started with the bot, follow these steps:

Clone this repository to your local machine using git clone https://github.com/Ark0N/webhook-tradingview-bot.git

Navigate to the project directory and install the required dependencies using npm install

Modify the config.js file in the root directory of the project and add your Binance API key and secret to the file.

A JSON message from TradingView to the Server looks like this:

{
  "strategy": "TUSDT",
  "action": "{{strategy.order.action}}",
  "contracts": "{{strategy.order.contracts}}",
  "ticker": "{{ticker}}",
  "position_size": "{{strategy.position_size}}"
}

Acknowledgment

This project was developed with the assistance of OpenAI's ChatGPT-4, a powerful language model that provided guidance on various aspects of the Node.js application development. The AI model was instrumental in offering suggestions, explanations, and best practices throughout the development process, helping to streamline the implementation and ensure a higher-quality final product.
