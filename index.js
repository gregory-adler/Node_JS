const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000

let AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

let yourApiKey = 'K66X37W9RVFUC4RQ';
let alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

let stocks = []
let ticker = ['MSFT', 'NVDA', 'AAPL']

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const getStocks = async (ticker) => {
  try {
  	console.log (ticker)
  	return axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact`).then(dailyData => {
		for (variable in dailyData.data['Time Series (Daily)']){
			// console.log (dailyData.data['Time Series (Daily)'][variable]['4. close']);
			stocks.push(dailyData['data']['Meta Data']['2. Symbol']);
			let value = formatter.format(dailyData.data['Time Series (Daily)'][variable]['4. close']);
 			stocks.push(value);
			break;
		}
		return stocks;
	})}catch(error){
  		console.error(error)
  	}}


for (i=0; i< ticker.length; i++){
  		// console.log (ticker[i]);
  		getStocks(ticker[i]).then(stocks=> console.log(stocks))
	}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index', {stocks:stocks}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))