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

const getCrypto = async (crypto) => {
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

const batchStocks = async (ticker) => {
	try {
		return axios.get(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=msft,aapl,googl&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact%27`).then(dailyData =>{
			
			// console.log (dailyData.data[`Stock Quotes`]);
			for (i =0; i< dailyData.data['Stock Quotes'].length; i++){
				let symbol = (dailyData.data['Stock Quotes'][i][`1. symbol`])
				let value = formatter.format(dailyData.data['Stock Quotes'][i][`2. price`])
				stocks.push([symbol, value])

			}
			return;
		})

	}
	catch(errror){
		console.error(error)
	}
}

const batchCryptos = async (crypto_ticker) => {
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
		getStock(ticker[i]).then(stocks=> console.log(stocks))
	}

}

const callCryptos = async () => {
// crypto calls
for (i=0; i< crypto_ticker.length; i++){
		getCrypto(crypto_ticker[i]).then(cryptos=> console.log(cryptos))
	}

}

batchStocks()
callCryptos()

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index', {stocks:stocks, cryptos:cryptos}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))