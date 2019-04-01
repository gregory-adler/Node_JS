const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000

let AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

let yourApiKey = 'K66X37W9RVFUC4RQ';
let alphaVantageAPI = new AlphaVantageAPI(yourApiKey, 'compact', true);

let stocks = []
let cryptos = []
let ticker = ['MSFT', 'NVDA', 'AAPL']
let crypto_ticker = ['BTC', 'ETH',]

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const getStocks = async (ticker) => {
  try {
  	return axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact`).then(dailyData => {
		for (variable in dailyData.data['Time Series (Daily)']){
			// console.log (dailyData.data['Time Series (Daily)'][variable]['4. close']);
			let value = formatter.format(dailyData.data['Time Series (Daily)'][variable]['4. close']);
			stocks.push([ticker, value]);
			break;
		}
		return stocks;
	})}
	catch(error){
  		console.error(error)
  	}}

const getCryptos = async (crypto) => {
	try {
	return axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${crypto}&to_currency=USD&apikey=K66X37W9RVFUC4RQ`).then(dailyData => {
			// console.log(typeof(dailyData));

			if (dailyData.data['Note']){
				console.log("No Data - API requests")
				return;
			}

			let value = formatter.format(dailyData.data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
			cryptos.push([crypto, value])
			return cryptos;
	}).catch(error =>{
		console.log(error.response)
	})} catch(error){
  		console.error(error)
  	}}


const batchCryptos = async (crypto_ticker) => {
	try {

	}
	catch(errror){
		console.error(error)
	}
}

const batchStocks = async (ticker) => {
	try {

	}
	catch(errror){
		console.error(error)
	}
}

// stock calls 
const callStocks = async () => {
for (i=0; i< ticker.length; i++){
		// console.log (ticker[i]);
		getStocks(ticker[i]).then(stocks=> console.log(stocks))
	}

}

const callCryptos = async () => {
// crypto calls
for (i=0; i< crypto_ticker.length; i++){
		getCryptos(crypto_ticker[i]).then(cryptos=> console.log(cryptos))
	}

}

callStocks()
callCryptos()

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index', {stocks:stocks, cryptos:cryptos}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))