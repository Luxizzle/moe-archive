const walk = require('../src/walk')
const path = require('path')
const test = require('ava')

const walkResult = require('./files/walk.json')

test('walk dir', async t => {
  t.deepEqual(await walk(path.join(__dirname, 'files')), walkResult)
})