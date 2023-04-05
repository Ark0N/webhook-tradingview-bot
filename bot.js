const express = require('express');
const bodyParser = require('body-parser');
const Binance = require('node-binance-api');
const config = require('./config');
const fs = require('fs');
const app = express();


app.use(bodyParser.json());

const binance = new // Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const Binance = require('node-binance-api');
const config = require('./config');
const fs = require('fs');

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
        return;
      }
      console.log('Order executed:', response);
    });
  } else {
    console.log('Invalid action:', action);
  }
}

function processTUSDT(alertData) {
  // Code to handle TUSDT alerts
  console.log('Processing TUSDT alert:', alertData);

  // Extract the necessary data from the alert
  const action = alertData.action;
  const contracts = parseFloat(alertData.contracts).toFixed(5); // Round to 5 decimal places
  const ticker = alertData.ticker;
  const positionSize = parseFloat(alertData.position_size).toFixed(5); // Round to 5 decimal places

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
        return;
      }
      console.log('Order executed:', response);
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
Binance().options({
  APIKEY: config.binance.APIKEY,
  APISECRET: config.binance.APISECRET,
  'family': 4,
  'baseUrl': 'https://api4.binance.com/api/', // Add this line to change the base URL
});


binance.balance((error, balances) => {
  if ( error ) return console.error(error);
  const usdtBalance = balances.USDT.available;
  const orderQuantity = Number((usdtBalance * 0.9).toFixed(2));
  console.info("USDT balance: ", usdtBalance);
  console.info("Order quantity: ", orderQuantity);
});