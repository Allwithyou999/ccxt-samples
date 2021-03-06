const ccxt = require("ccxt");

async function getCcxtTradingRules(exchangeId, symbol, finalOpts) {
  let allMarkets;
  const exchange = new ccxt[exchangeId](finalOpts);
  exchange.loadMarkets();

  if (!exchange.has["fetchMarkets"]) {
    console.log(
      exchange.id +
        " does not have fetchMarkets() yet, make sure your version of CCXT is up to date."
    );
  } else {
    allMarkets = await exchange.fetchMarkets();
  }

  let i = 0;
  const tradingRule = {
    exchangeId,
    symbol,
    minTradeAmount: "",
    minPriceMovement: "",
    minOrderSize: "",
    maximumMarketOrderAmount: "",
  };

  while (allMarkets) {
    const market = allMarkets[i];
    i++;

    if (market && symbol === market["symbol"] && market["limits"]) {
      tradingRule.minTradeAmount = market["limits"]["amount"]["min"];
      tradingRule.minPriceMovement = market["limits"]["price"]["min"];
      tradingRule.minOrderSize = market["limits"]["cost"]["min"];

      if (market["limits"]["market"]) {
        tradingRule.maximumMarketOrderAmount =
          market["limits"]["market"]["max"];
      }

      break;
    }
  }

  console.log(tradingRule);

  return tradingRule;
}

const exchangeIds = ["binance", "bitfinex"]; // huobipro
const symbols = ["FTT/BTC"];
const finalOpts = {
  binance: {
    apiKey: "---",
    secret: "---",
    uid: "",
    password: "",
    timeout: 30000,
    enableRateLimit: true,
    verbose: false,
  },
  bitfinex: {
    apiKey: "----",
    secret: "----",
    uid: "",
    password: "",
    timeout: 30000,
    enableRateLimit: true,
    verbose: false,
  },
};

getCcxtTradingRules(exchangeIds[0], symbols[0], finalOpts[exchangeIds[0]]);
