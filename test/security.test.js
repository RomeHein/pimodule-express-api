/* global test, describe, afterAll, jest, expect */

jest.mock('pimodule', () => jest.fn())
process.env.apiPassword = 'test'
const bcrypt = require('bcrypt')

const server = require('../server')
const supertest = require('supertest')
const request = supertest(server)

describe('Check api security', () => {
  afterAll(() => {
    server.close()
  })

  test(`should respond 403 (forbidden)`, async () => {
    const res = await request.get(`/pimodule/state`)
    expect(res.status).toBe(403)

    const res2 = await request.get(`/pimodule/state`)
      .set('Authorization', 'wrong')
    return expect(res2.status).toBe(403)
  })

  test(`should respond 400 (authorized)`, async () => {
    const hash = bcrypt.hashSync(process.env.apiPassword, 8)
    const res = await request
      .get(`/pimodule/test`)
      .set('Authorization', hash)
    return expect(res.status).toBe(404)
  })
})
