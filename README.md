# webhook-tradingview-bot
This is a simple Node.js application that listens for webhook messages from Binance and places market buy/sell orders based on the alerts received. 

The bot is built using the node-binance-api library, which provides a simple and easy-to-use API for interacting with the Binance exchange.

Getting Started
To get started with the bot, follow these steps:

Clone this repository to your local machine using git clone https://github.com/your-username/binance-webhook-bot.git

Navigate to the project directory and install the required dependencies using npm install

Modify the config.js file in the root directory of the project and add your Binance API key and secret to the file in the following format:

javascript
Copy code
module.exports = {
  binance: {
    APIKEY: 'your-api-key',
    APISECRET: 'your-api-secret'
  }
}

A JSON message from TradingView to the Server looks like this:

{
  "strategy": "TUSDT",
  "action": "{{strategy.order.action}}",
  "contracts": "{{strategy.order.contracts}}",
  "ticker": "{{ticker}}",
  "position_size": "{{strategy.position_size}}"
}
