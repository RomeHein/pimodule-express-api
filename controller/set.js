const catchError = require('../catchError')
module.exports = function (webserver) {
  console.log('✅ API set loaded')

  webserver.get('/pimodule/switch/:hardware/:on?', async (req, res) => {
    try {
      switch (req.params.hardware) {
        case 'auxilarypower':
          await PiModuleHelper.switchBackedAuxilaryPower(req.params.on)
          break
        case 'buzzer':
          await PiModuleHelper.switchBuzzer(req.params.on)
          break
        case 'relay':
          await PiModuleHelper.switchBiStableRelay(req.params.on)
          break
        case 'ledorange': case 'ledgreen': case 'ledblue':
          await PiModuleHelper.switchLed(req.params.hardware.substring(3), req.params.on)
          break
        default:
          // Let pimodule helper handle errors
          await PiModuleHelper.switch(req.params.hardware, req.params.on)
      }
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.get('/pimodule/shutdown/:timer', async (req, res) => {
    try {
      await PiModuleHelper.setShutdownTimer(req.params.timer)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.get('/pimodule/shutdown/stop', async (req, res) => {
    try {
      await PiModuleHelper.stopShutdownTimer()
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.get('/pimodule/fan/mode/:mode', async (req, res) => {
    try {
      await PiModuleHelper.setFanMode(req.params.mode)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.get('/pimodule/fan/speed/:speed', async (req, res) => {
    try {
      await PiModuleHelper.setFanSpeed(req.params.speed)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.get('/pimodule/fan/temperature/:treshold?', async (req, res) => {
    try {
      await PiModuleHelper.setFanTemperatureTreshold(req.params.treshold)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  webserver.post('/pimodule/sounds', async (req, res) => {
    try {
      await PiModuleHelper.playSounds(req.body)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })
}
