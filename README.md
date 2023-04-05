# webhook-tradingview-bot
A Webhook Server for Tradingview Alerts that execute on the Binance Exchange
A JSON message from TradingView to the Server looks like this:

{
  "strategy": "TUSDT",
  "action": "{{strategy.order.action}}",
  "contracts": "{{strategy.order.contracts}}",
  "ticker": "{{ticker}}",
  "position_size": "{{strategy.position_size}}"
}

or this:

{
  "strategy": "USDINFLATION",
  "action": "{{strategy.order.action}}",
  "contracts": "{{strategy.order.contracts}}",
  "ticker": "{{ticker}}",
  "position_size": "{{strategy.position_size}}"
}
