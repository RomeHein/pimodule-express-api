
const swaggerJSDoc = require('swagger-jsdoc')

module.exports = function (webserver) {
  console.log('✅ API documentation loaded')

  const swaggerDefinition = {
    info: {
      title: 'API for UPS PIco HV3.0A/B/B+ HAT',
      version: '1.0.0',
      description: 'Features provided by the Pico'
    },
    host: `localhost:${process.env.apiPort || 7070}`,
    basePath: '/'
  }
  const options = {
    swaggerDefinition,
    apis: ['./controller/set.js', './controller/state.js']
  }
  const swaggerSpec = swaggerJSDoc(options)

  webserver.get('/swagger.json', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  webserver.get('/doc', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
      <head>
        <title>PiModule API Docs</title>
        <meta charset="utf-8"/>
        <link rel="shortcut icon" type="image/x-icon" href="https://quizizz.com/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url='http://localhost:${process.env.apiPort || 7070}/swagger.json' expand-responses="all"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
      </body>
    </html>`)
  })
}
