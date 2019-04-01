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


const batchCryptos = async (crypto_ticker) => {
	try {

	}
	catch(errror){
		console.error(error)
	}
}

const callCryptos = async () => {
// crypto calls
for (i=0; i< crypto_ticker.length; i++){
		getCrypto(crypto_ticker[i]).then(cryptos=> console.log(cryptos))
	}

}
callCryptos()

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', api_controller.getStocks)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))