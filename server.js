const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const PiModuleHelper = require('pimodule')

module.exports = async () => {
  global.PiModuleHelper = new PiModuleHelper(process.env.piModuleAddressType)

  let webserver = express()
  webserver.use(bodyParser.json())
  webserver.use(bodyParser.urlencoded({ extended: true }))
  webserver.use(express.static('public'))

  webserver.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))

  // Checking authorisations
  webserver.use((req, res, next) => {
    const hashedPassword = req.headers.authorization
    if (process.env.apiPassword && bcrypt.compareSync(process.env.apiPassword, hashedPassword)) {
      next()
    } else {
      res.status(403).json({
        message: 'No authorisations'
      })
    }
  })

  webserver.listen(process.env.apiPort || 7070)

  // import all the pre-defined routes that are present in /api/controller that will create the restfull API
  let normalizedPathRoutes = path.join(__dirname, 'controllers')
  fs.readdirSync(normalizedPathRoutes).forEach(function (file) {
    require('./controllers/' + file)(webserver)
  })

  return webserver
}
