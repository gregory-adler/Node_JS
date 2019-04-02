const express = require('express')
const path = require('path')
const axios = require('axios')
const PORT = process.env.PORT || 5000
const api_controller = require('./controller/apiController.js');


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', api_controller.getData)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))