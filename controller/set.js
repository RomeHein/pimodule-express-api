const catchError = require('../catchError')
module.exports = function (webserver) {
  console.log('✅ API set loaded')

  /**
 * @swagger
 * /pimodule/switch/{harware}/{on}:
 *   get:
 *     summary: Switch a specific hardware on or off
 *     tags:
 *       - switch
 *     parameters:
 *       - in: path
 *         name: hardware
 *         type: string
 *         required: true
 *         description: the harware to turn on/off. Possible values *'auxilarypower', 'ledgreen', 'ledorange', 'ledblue', 'buzzer', 'relay'*
 *       - in: path
 *         name: on
 *         type: integer
 *         required: false
 *         description: the state you wish to set the hardware. Note that this part can be ommited, and therefor considered false.
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/switch/:hardware/:on?', async (req, res) => {
    try {
      switch (req.params.hardware) {
        case 'auxilarypower':
          await PiModuleHelper.switchBackedAuxilaryPower(+req.params.on)
          break
        case 'buzzer':
          await PiModuleHelper.switchBuzzer(+req.params.on)
          break
        case 'relay':
          await PiModuleHelper.switchBiStableRelay(+req.params.on)
          break
        case 'ledorange': case 'ledgreen': case 'ledblue':
          await PiModuleHelper.switchLed(req.params.hardware.substring(3), +req.params.on)
          break
        default:
          // Let pimodule helper handle errors
          await PiModuleHelper.switch(req.params.hardware, +req.params.on)
      }
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/shutdown/{time}:
 *   get:
 *     summary: Start a shutdown timer
 *     description: Setting up the shutdown timer will cause the raspberry pi to automatically shutdown. At any time you can reset the time by calling this root again.
 *     tags:
 *       - shutdown
 *     parameters:
 *       - in: path
 *         name: time
 *         type: integer
 *         required: true
 *         description: Time in seconds, maximum *596s*
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/shutdown/:timer', async (req, res) => {
    try {
      await PiModuleHelper.setShutdownTimer(req.params.timer)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/shutdown/stop:
 *   get:
 *     summary: Stop the currently running shutdown timer
 *     tags:
 *      - shutdown
 *     description: Simply turn off the current shutdown timer
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/shutdown/stop', async (req, res) => {
    try {
      await PiModuleHelper.stopShutdownTimer()
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/fan/mode/{mode}:
 *   get:
 *     summary: Set fan mode
 *     description: Three mode are available, 0 to disable fan, 1 to set manual speed, 2 to set automatic speed
 *     tags:
 *       - fan
 *     parameters:
 *       - in: path
 *         name: mode
 *         type: integer
 *         required: true
 *         description: 0 to disable fan, 1 to set manual speed, 2 to set automatic speed
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/fan/mode/:mode', async (req, res) => {
    try {
      await PiModuleHelper.setFanMode(req.params.mode)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/fan/speed/{speed}:
 *   get:
 *     summary: Set fan speed
 *     description: The fan speed is defined in %.
 *     tags:
 *       - fan
 *     parameters:
 *       - in: path
 *         name: speed
 *         type: integer
 *         required: true
 *         description: 0 to 100 in %
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/fan/speed/:speed', async (req, res) => {
    try {
      await PiModuleHelper.setFanSpeed(req.params.speed)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/fan/temperature/{treshold}:
 *   get:
 *     summary: Set fan temperature treshold
 *     description: Set the temperature at which the PIco fan start. This parameter will be used only if the fan mode is set to automatic.
 *     tags:
 *       - fan
 *     parameters:
 *       - in: path
 *         name: speed
 *         type: integer
 *         required: true
 *         description: 0 to 60 degree Celsius
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/fan/temperature/:treshold?', async (req, res) => {
    try {
      await PiModuleHelper.setFanTemperatureTreshold(req.params.treshold)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })

  /**
 * @swagger
 * /pimodule/sounds:
 *   post:
 *     summary: Play sounds from built-in buzzer
 *     tags:
 *       - buzzer
 *     requestBody:
 *       description: An array of array. Each array contains two value, the first one should be the frequency of the sound and the second one the duration.
 *       required: true
 *       example:
 *         name: Imperial march
 *         summary: Play the star wars imperial march
 *         value: [[220, 700],[220, 700],[220, 700],[174, 525],[261, 175],[220, 700],[174, 525],[261, 175],[220, 1400]]
 *     responses:
 *       200:
 */
  webserver.post('/pimodule/sounds', async (req, res) => {
    try {
      await PiModuleHelper.playSounds(req.body)
      res.sendStatus(200)
    } catch (err) {
      catchError(res, err)
    }
  })
}
