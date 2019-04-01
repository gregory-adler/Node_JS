const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000
const api_controller = require('./controller/apiController.js');

let AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

let yourApiKey = 'K66X37W9RVFUC4RQ';
let alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

let stocks = []
let cryptos = []
let ticker = ['MSFT', 'NVDA', 'AAPL', 'GOOGL', 'AMD']
let crypto_ticker = ['BTC', 'ETH',]

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', api_controller.getData)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))