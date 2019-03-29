const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000

var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

var yourApiKey = 'K66X37W9RVFUC4RQ';
var alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

let stocks = []

const getStocks = async () => {
  try {
  	return axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact").then(dailyData => {
        	for (variable in dailyData.data['Time Series (Daily)']){
        		// console.log (dailyData.data['Time Series (Daily)'][variable]['4. close']);
        		stocks.push(dailyData['data']['Meta Data']['2. Symbol']);
        		stocks.push(dailyData.data['Time Series (Daily)'][variable]['4. close']);
        		return stocks;
        	}
        	})
  	} catch(error){
  		console.error(error)
  	}}


getStocks().then(stocks => console.log(stocks))

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index', {stocks:stocks}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))