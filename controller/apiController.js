const axios = require('axios')

let ticker = ['MSFT', 'NVDA', 'AAPL', 'GOOGL', 'AMD']
let stocks = []

let crypto_ticker = ['BTC', 'ETH']
let cryptos = ['7', '4']

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

exports.getStocks = function (req, res){
	console.log ("stock controller")
	stocks = []

	try {
		let conc_string = ''
		for (i=0; i< ticker.length; i++){
			if (i==ticker.length){
				continue
			}
			conc_string= conc_string + ticker[i] + ','
		}

		return axios.get(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${conc_string}&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact%27`).then(dailyData =>{


			if (dailyData.data['Note']){
				console.log("No Data - API requests")
				return;
			}
			
			// console.log (dailyData.data[`Stock Quotes`]);
			for (i =0; i< dailyData.data['Stock Quotes'].length; i++){
				let symbol = (dailyData.data['Stock Quotes'][i][`1. symbol`])
				let value = formatter.format(dailyData.data['Stock Quotes'][i][`2. price`])
				stocks.push([symbol, value])

			}
			stocks.sort()
			console.log(stocks)

			res.render('pages/index', {stocks: stocks, cryptos: cryptos})
			// res.send(stocks);
		})

	}
	catch(error){
		console.error(error)
	}

}


exports.getCryptos = function (req, res){
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



const callCryptos = async () => {
// crypto calls
for (i=0; i< crypto_ticker.length; i++){
		getCrypto(crypto_ticker[i]).then(cryptos=> console.log(cryptos))
	}

}
