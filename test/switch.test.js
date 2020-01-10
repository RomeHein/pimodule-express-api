/* global test, describe, afterAll, jest, expect */

jest.mock('pimodule', () => {
  return jest.fn().mockImplementation(() => {
    this.switchable = ['auxilaryPower', 'buzzer', 'relay', 'ledGreen', 'ledOrange', 'ledBlue']
    return {
      switchable: this.switchable,
      switch: jest.fn(),
      switchBackedAuxilaryPower: jest.fn(),
      switchBuzzer: jest.fn(),
      switchLed: jest.fn(),
      switchBiStableRelay: jest.fn()
    }
  })
})
const PiModuleHelper = require('pimodule')
const server = require('../server')
const supertest = require('supertest')
const request = supertest(server)

describe('Check state api', () => {
  const piModule = new PiModuleHelper()

  afterAll(() => {
    server.close()
  })

  test(`should get 200 from all setable root`, async () => {
    const custom = ['auxilarypower', 'ledgreen', 'ledorange', 'ledblue']
    for (const switchable of [...piModule.switchable, ...custom]) {
      const res = await request.get(`/pimodule/switch/${switchable}`)
      expect(res.status).toBe(200)
    }
  })
})
