const catchError = require('../catchError')

module.exports = function (webserver) {
  console.log('✅ API state loaded')

  /**
 * @swagger
 * /pimodule/state/{hardware}:
 *   get:
 *     summary: Get harware state
 *     description: retrieve the current state of a specific PIco hardware.
 *     tags:
 *       - state
 *     parameters:
 *       - in: path
 *         name: harware
 *         type: string
 *         required: true
 *         description: Any of 'poweringmode', 'battery', 'temperature', 'auxilarypower', 'buzzer', 'relay', 'ledgreen', 'ledorange', 'ledblue', 'fanmode', 'fanspeed', 'fan'
 *     responses:
 *       200:
 */
  webserver.get('/pimodule/state/:hardware?', async (req, res) => {
    try {
      let state
      if (req.params.hardware) {
        switch (req.params.hardware) {
          case 'fan':
            state = await PiModuleHelper.fanIsRunning()
            break
          case 'fanmode':
            state = await PiModuleHelper.getFanMode()
            break
          case 'fanspeed':
            state = await PiModuleHelper.getFanSpeed()
            break
          case 'powermode':
            state = await PiModuleHelper.getPoweringMode()
            break
          case 'battery':
            state = await PiModuleHelper.getBatteryLevel()
            break
          case 'auxilarypower':
            state = await PiModuleHelper.get('auxilaryPower')
            break
          case 'ledorange': case 'ledgreen': case 'ledblue':
            const capColor = req.params.hardware.charAt(3).toUpperCase() + req.params.hardware.substring(4)
            state = await PiModuleHelper.get('led' + capColor, req.params.on)
            break
          default:
            // Would handle temperature, relay etc
            state = await PiModuleHelper.get(req.params.hardware)
        }
      } else {
        state = await PiModuleHelper.piModuleIsRunningProperly()
      }

      res.status(200).send(state)
    } catch (err) {
      catchError(res, err)
    }
  })
}
