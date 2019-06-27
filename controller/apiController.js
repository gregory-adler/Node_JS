const axios = require('axios')
const fs = require('fs');

// styles currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})


// styles time
let options = {  
	hour: "2-digit", minute: "2-digit" , second: "2-digit", hour12: true
};  


const getStocks= function (stocks, ticker){
	// console.log ("stock controller")

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
				stocks= loadStocks()
				return stocks;
			}

			const today = new Date()
			let stock_index = 0

			let time = today.toLocaleTimeString("en-us", options); 
			
			for (i =0; i< dailyData.data['Stock Quotes'].length; i++){
				let symbol = (dailyData.data['Stock Quotes'][i][`1. symbol`])
				let value = formatter.format(dailyData.data['Stock Quotes'][i][`2. price`])
				stock_index += Number(dailyData.data['Stock Quotes'][i][`2. price`])
				let url = `/stockicons/${symbol.toLowerCase()}.svg`
				stocks.push([symbol, value, time, url])

			}
			stocks.sort()
			return [stocks, stock_index]
		}
		)
	}
	catch(error){
		console.error(error)
	}

}

const getCryptos = function(cryptos){

	try {
		return axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD`, 
			{'headers': { 
  				'X-CMC_PRO_API_KEY': 'b0417a80-7767-47ed-81f8-578f6345e7c8' 
  			} }).then(response =>{
  				// console.log(response.data.data)
  				const today = new Date()
  				let crypto_index = 0

				let time = today.toLocaleTimeString("en-us", options); 


				for (i =0; i<response.data.data.length; i++){
					// console.log(response.data.data)
					let symbol = (response.data.data[i]['symbol'])

					// skip usd tether
					if (symbol == 'USDT'){
						continue;
					}
					let rank = response.data.data[i]['cmc_rank']
					let value = formatter.format(response.data.data[i]['quote']['USD']['price'])
					crypto_index += Number(response.data.data[i]['quote']['USD']['price'])
					let day = response.data.data[i]['quote']['USD']['percent_change_24h'].toFixed(2) + '%'
					let week = response.data.data[i]['quote']['USD']['percent_change_7d'].toFixed(2) + '%'
					let url = `/cryptocurrency-icons/svg/color/${symbol.toLowerCase()}.svg`
					cryptos.push([rank, symbol, value, url, day, week, time])

					// console.log(cryptos)
				}
				if (cryptos.length == 0){
					cryptos = loadCryptos()
					return [cryptos, 0]
				}

				crypto_index.toFixed(2)
				return [cryptos, crypto_index]

		}).catch(error =>{
				console.log("crypto api error")
  				cryptos = loadCryptos()
  				return cryptos
  			})

	} catch(error){
		console.error(error)
	}

}

const getAggregate = function(aggregates){

	try{
		return axios.get(`https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`, 
			{'headers': { 
  				'X-CMC_PRO_API_KEY': 'b0417a80-7767-47ed-81f8-578f6345e7c8' 
  			} }).then(response =>{
  				// console.log(response.data.data)
  				let value

  				for (let property in response.data.data){
  					if (response.data.data.hasOwnProperty(property)){
  						// console.log (response.data.data[property])
  						if (property == 'eth_dominance' || property == 'btc_dominance'){
  							value = response.data.data[property]
  							value = value.toFixed(2) + '%'
  							aggregates.push([property, value])
  						}
  					}
  				}

  				return aggregates

	}).catch(error =>{
				console.log("getAggregate api error")
				return 1
  			})

	} catch(error){
		console.error(error)
	}

	return 
}


const saveCryptos = async(cryptos) =>{
	await cryptos;
	const jsonContent = JSON.stringify(cryptos);

	fs.writeFile("./cryptos.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}

const saveStocks = async(stocks) =>{
	await stocks;
	const jsonContent = JSON.stringify(stocks);

	fs.writeFile("./stocks.json", jsonContent, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

    	console.log("The file was saved!");
	}); 
}

const loadStocks = async () => {
	let stockData = fs.readFileSync('./stocks.json');  
	let stocks = JSON.parse(stockData);
	console.log ("stocks loaded")
	return stocks
}


const loadCryptos = async () => {
	let cryptoData = fs.readFileSync('./cryptos.json');  
	let cryptos = JSON.parse(cryptoData);
	console.log ("cryptos loaded")
	// console.log(cryptos)
	return cryptos

}

const functionCaller = async () =>{
	let ticker = ['MSFT', 'NVDA', 'AAPL', 'GOOGL', 'AMD', 'SPOT', 'TSLA', 'NFLX', 'FB']
	let cryptos = []
	let aggregates = []
	let stocks = []
	let data = [2]
	stock_index = 0
	crypto_function = getCryptos(cryptos)
	stock_function= getStocks(stocks, ticker)
	aggregates = getAggregate(aggregates)

	stock_function.then(stocks => {
		data[0]= stocks[0]
		stock_index += stocks[1]
	})

	crypto_function.then(cryptos=> {
		data[1]= cryptos[0]
		crypto_index = cryptos[1]
	})

	await cryptos
	await stock_function
	aggregates.then(aggregates => {
		data[2] = aggregates
		data[2].push(['stock_index', '$' + stock_index.toFixed(2)])
		data[2].push(['crypto_index', '$' + crypto_index.toFixed(2)])

	})
	await aggregates
	console.log(data)
	return data

}


exports.getData = function (req, res){

	functionCaller().then(data => { 
		let stocks = data[0]
		let cryptos = data[1]
		let aggregate = data[2]
		res.render('pages/index', {stocks: stocks, cryptos: cryptos, aggregates: aggregate})
		saveStocks(stocks)
		saveCryptos(cryptos)
	})

}