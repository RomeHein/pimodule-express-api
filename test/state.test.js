/* global test, describe, expect, jest, afterAll */

jest.mock('pimodule', () => {
  return jest.fn().mockImplementation(() => {
    this.getable = ['poweringMode', 'batteryLevel', 'temperature', 'auxilaryPower', 'buzzer', 'relay', 'ledGreen', 'ledOrange', 'ledBlue', 'fanMode', 'fanSpeed', 'fanRunning', 'fanTemperatureTreshold']
    return {
      getable: this.getable,
      get: hardware => {
        if (this.getable.indexOf(hardware) === -1) {
          throw new Error('Unkown')
        }
      },
      piModuleIsRunningProperly: jest.fn(),
      getBatteryLevel: jest.fn(),
      getFanSpeed: jest.fn(),
      getPoweringMode: jest.fn(),
      getFanMode: jest.fn(),
      fanIsRunning: jest.fn()
    }
  })
})

const PiModuleHelper = require('pimodule')
const server = require('../server')
const supertest = require('supertest')
const request = supertest(server)

describe('Check state api', () => {
  const piModule = new PiModuleHelper()

  afterAll(async () => {
    await server.close()
  })

  test(`should get 200 from all getable root`, async () => {
    const customRoot = ['fan', 'fanmode', 'fanspeed', 'powermode', 'auxilarypower', 'ledorange', 'ledgreen', 'ledblue']
    for (const getable of [...piModule.getable, ...customRoot]) {
      const res = await request.get(`/pimodule/state/${getable}`)
      expect(res.status).toBe(200)
    }

    const res = await request.get(`/pimodule/state`)
    return expect(res.status).toBe(200)
  })

  test(`should return error for unknown harware state`, async () => {
    const res = await request.get(`/pimodule/state/unknown`)
    return expect(res.status).toBe(400)
  })
})
