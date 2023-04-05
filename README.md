# webhook-tradingview-bot
This is a Node.js application that listens for Webhook messages from Tradingview and places market buy/sell orders on Binance based on the alerts received. 

The bot is built using the node-binance-api library, which provides a simple and easy-to-use API for interacting with the Binance exchange.

Getting Started
To get started with the bot, follow these steps:

Clone this repository to your local machine using git clone https://github.com/your-username/binance-webhook-bot.git

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
