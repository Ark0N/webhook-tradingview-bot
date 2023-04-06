// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const Binance = require('node-binance-api');
const config = require('./config');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Set up the Telegram bot
const bot = new TelegramBot(config.telegram.TOKEN, { polling: false });
const targetChatId = 'CHATID';

// Send a message to the chat when the bot starts
const startupMessage = 'The bot has started successfully!';
bot.sendMessage(targetChatId, startupMessage);

// Create an instance of the Express application
const app = express();

// Set up middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Set up the Binance API client with the API key and secret from the config file
const binance = new Binance().options({
  APIKEY: config.binance.APIKEY,
  APISECRET: config.binance.APISECRET,
  'family': 4,
  'baseUrl': 'https://api4.binance.com/api/',
});

// Get the USDT balance for the API key associated with the client
binance.balance((error, balances) => {
  if ( error ) return console.error(error);
  console.info("USDT balance: ", balances.USDT.available);
  console.info("TUSD balance: ", balances.TUSD.available);
});


// Set up a POST endpoint to receive webhook messages from TradingView
app.post('/webhook', (req, res) => {
  const alertData = req.body;

  // Log the incoming message
  console.log('Received message:', alertData);

  // Process the alert data based on the strategy specified in the message
  processAlertData(alertData);

  // Send a response to the webhook
  res.json({ status: 'success' });
});

// Function to process alert data based on the specified strategy
function processAlertData(alertData) {
  const strategy = alertData.strategy;

  if (strategy === 'USDINFLATION') {
    // Call the function to process the USD inflation strategy
    processUSDInflationStrategy(alertData);
  } else if (strategy === 'TUSDT') {
    // Call the function to process strategy 2
    processTUSDT(alertData);
  } else if (strategy === 'STRATEGY3') {
    // Call the function to process strategy 3
    processStrategy3(alertData);
  } else if (strategy === 'STRATEGY4') {
    // Call the function to process strategy 4
    processStrategy4(alertData);
  } else {
    // Log an error message if the strategy is invalid or not supported
    console.log('Invalid strategy or strategy not supported:', strategy);
  }
}

// Function to process the USD inflation strategy
function processUSDInflationStrategy(alertData) {
  // Extract the necessary data from the alert
  const action = alertData.action;
  const contracts = parseFloat(alertData.contracts);
  const ticker = alertData.ticker;
  const positionSize = parseFloat(alertData.position_size);

  // Convert the ticker to the format required by the Binance API
  const ccxtSymbol = `${ticker.slice(0, -4)}${ticker.slice(-4)}`;

  if (action === 'buy') {
    // Place a market buy order
    binance.marketBuy(ccxtSymbol, contracts, (error, response) => {
      if (error) {
        console.error(error);
        // Log the error message to a file
        fs.appendFile('error-log.txt', JSON.stringify(error) + '\n', (err) => {
          if (err) {
            console.error('Error writing to error-log.txt:', err);
          }
        });
        return;
      }
      // Log the order details
      console.log('Order executed:', response);
      const tvMessage = `From TradingView:\nStrategy: USDINFLATION\nAction: ${action}\nContracts: ${contracts}\nTicker: ${ticker}\nPosition Size: ${positionSize}`;
      bot.sendMessage(targetChatId, tvMessage);
    });
  } else if (action === 'sell') {
    // Place a market sell order
    binance.marketSell(ccxtSymbol, contracts, (error, response) => {
      if (error) {
        console.error(error);
        fs.appendFile('error-log.txt', JSON.stringify(error) + '\n', (err) => {
          if (err) {
            console.error('Error writing to error-log.txt:', err);
            const tvMessage = `From TradingView:\nStrategy: USDINFLATION\nAction: ${action}\nContracts: ${contracts}\nTicker: ${ticker}\nPosition Size: ${positionSize}`;
            bot.sendMessage(targetChatId, tvMessage);
          }
        });
        return;
      }
      const tvMessage = `From TradingView:\nStrategy: USDINFLATION\nAction: ${action}\nContracts: ${contracts}\nTicker: ${ticker}\nPosition Size: ${positionSize}`;
      bot.sendMessage(targetChatId, tvMessage);
      console.log('Order executed:', response);
    });
  } else {
    console.log('Invalid action:', action);
  }
}

function processTUSDT(alertData) {
  // Extract the necessary data from the alert
  const action = alertData.action;
  const contracts = parseFloat(alertData.contracts).toFixed(5); // Round to 5 decimal places
  const ticker = alertData.ticker;
  const positionSize = parseFloat(alertData.position_size).toFixed(5); // Round to 5 decimal places
  const tvTimestamp = Date.now();
  const tvMessage = `Alert from TradingView (${tvTimestamp} ms):\nStrategy: TUSDT\nAction: ${action}\nContracts: ${contracts}\nTicker: ${ticker}\nPosition Size: ${positionSize}`;
  bot.sendMessage(targetChatId, tvMessage);

  // Convert the ticker to the format required by the Binance API
  const ccxtSymbol = `${ticker.slice(0, -4)}${ticker.slice(-4)}`;

  if (action === 'buy') {
    // Place a market buy order
    binance.marketBuy(ccxtSymbol, contracts, (error, response) => {
      if (error) {
        console.error(error);
        // Log the error message to a file
        fs.appendFile('error-log.txt', JSON.stringify(error) + '\n', (err) => {
          if (err) {
          }
        });
        const errorMessage = `From Binance:\nError:\n${JSON.stringify(error)}`;
        bot.sendMessage(targetChatId, errorMessage);      
        return;
      }
      // Send the Binance response to the Telegram chat
      const binanceTransactTime = response.transactTime;
      const timeOffset = binanceTransactTime - tvTimestamp;
      const binanceMessage = `From Binance:\nOrder executed:\nSymbol: ${response.symbol}\nOrder ID: ${response.orderId}\nClient Order ID: ${response.clientOrderId}\nTransact Time: ${new Date(response.transactTime)}\nPrice: ${response.price}\nOrig Qty: ${response.origQty}\nExecuted Qty: ${response.executedQty}\nCummulative Quote Qty: ${response.cummulativeQuoteQty}\nStatus: ${response.status}\nTime In Force: ${response.timeInForce}\nType: ${response.type}\nSide: ${response.side}\nWorking Time: ${new Date(response.workingTime)}\nFills:\n${response.fills.map(fill => `  Price: ${fill.price}\n  Qty: ${fill.qty}\n  Commission: ${fill.commission}\n  Commission Asset: ${fill.commissionAsset}\n  Trade ID: ${fill.tradeId}\n`).join('\n')}\nTime Offset: ${timeOffset} ms`;
      bot.sendMessage(targetChatId, binanceMessage);
      // Log the order details
      console.log('Order executed:', response);

    });
  } else if (action === 'sell') {
    // Place a market sell order
    binance.marketSell(ccxtSymbol, contracts, (error, response) => {
      if (error) {
        console.error(error);
        fs.appendFile('error-log.txt', JSON.stringify(error) + '\n', (err) => {
          if (err) {
            console.error('Error writing to error-log.txt:', err);
          }
        });
        const errorMessage = `From Binance:\nError:\n${JSON.stringify(error)}`;
        bot.sendMessage(targetChatId, errorMessage);      
        return;
      }
      console.log('Order executed:', response);

      // Send the Binance response to the Telegram chat
      const binanceMessage = `From Binance:\nOrder executed:\n${JSON.stringify(response)}`;
      bot.sendMessage(targetChatId, binanceMessage);
    });
  } else {
    console.log('Invalid action:', action);
  }
}



function processStrategy3(alertData) {
  // Code to handle STRATEGY3 alerts
  console.log('Processing STRATEGY3 alert:', alertData);
}

function processStrategy4(alertData) {
  // Code to handle STRATEGY4 alerts
  console.log('Processing STRATEGY4 alert:', alertData);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
