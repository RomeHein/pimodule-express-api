const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const PiModuleHelper = require('pimodule')

global.PiModuleHelper = new PiModuleHelper(process.env.piModuleAddressType)

let app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Checking authorisations
app.use((req, res, next) => {
  const hashedPassword = req.headers.authorization
  if ((process.env.apiPassword && hashedPassword && bcrypt.compareSync(process.env.apiPassword, hashedPassword)) || !process.env.apiPassword) {
    next()
  } else {
    res.status(403).json({
      message: 'No authorisations'
    })
  }
})

const server = app.listen(process.env.apiPort || 7070, () => {
  if (process.env.apiPassword) {
    console.log(`Your API autorization token is: ${bcrypt.hash(process.env.apiPassword, 8)}
    Copy past this token into your autorization header key.`)
  }
})

// import all the pre-defined routes that are present in /api/controller that will create the restfull API
let normalizedPathRoutes = path.join(__dirname, 'controller')
fs.readdirSync(normalizedPathRoutes).forEach(function (file) {
  require('./controller/' + file)(app)
})

module.exports = server
