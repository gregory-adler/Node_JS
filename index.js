const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

var yourApiKey = 'K66X37W9RVFUC4RQ';
var alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

alphaVantageAPI.getDailyData('MSFT');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
