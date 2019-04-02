const axios = require('axios')
const rp = require('request-promise');

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const getStocks= function (stocks, ticker){
	console.log ("stock controller")

	try {
		let conc_string = ''
		for (i=0; i< ticker.length; i++){
			if (i==ticker.length){
				conc_string= conc_string + ticker[i]
				continue
			}
			conc_string= conc_string + ticker[i] + ','
		}

		return axios.get(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${conc_string}&apikey=K66X37W9RVFUC4RQ&datatype=json&outputsize=compact%27`).then(dailyData =>{

			// api overload
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
			return stocks
		}
		)
	}
	catch(error){
		console.error(error)
	}

}

const getCryptos = function(cryptos){
	console.log ("crypto controller")

	try {
		axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD`, 
			{'headers': { 
  				'X-CMC_PRO_API_KEY': 'b0417a80-7767-47ed-81f8-578f6345e7c8' 
  			} }).then(response =>{
  				// console.log(response.data.data)
				for (i =0; i<response.data.data.length; i++){
					// console.log(response.data.data)
					let symbol = (response.data.data[i]['symbol'])
					let value = formatter.format(response.data.data[i]['quote']['USD']['price'])
					cryptos.push([symbol, value])
				}
				cryptos.sort()
				console.log(cryptos)
				return cryptos
		}
		)

	} catch(error){
		console.error(error)
	}

}

const saveCryptos = async(cryptos) =>{
	const fs = require('fs');
	await cryptos;
	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
	const jsonContent = JSON.stringify(cryptos);

	fs.writeFile("./cryptos.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}

const saveStocks = async(stocks) =>{
	const fs = require('fs');
	await stocks;
	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
	const jsonContent = JSON.stringify(stocks);

	fs.writeFile("./stocks.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}



exports.getData = function (req, res){
	let stocks = []
	let cryptos = []
	let ticker = ['MSFT', 'NVDA', 'AAPL', 'GOOGL', 'AMD']

	getCryptos(cryptos)
	getStocks(stocks, ticker).then(stocks => { 
		res.render('pages/index', {stocks: stocks, cryptos: cryptos})
		saveStocks(stocks)
		saveCryptos(cryptos)

	})

}
