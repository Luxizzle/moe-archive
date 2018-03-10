const archive = require('../src/archive')
const test = require('ava')
const fs = require('fs')
const path = require('path')

const testJson = require('./files/archive-test.json')
const testArchivePretty = fs.readFileSync(path.join(__dirname, 'files', 'archive-test-pretty.moe-archive'), 'utf8')
const testArchive = fs.readFileSync(path.join(__dirname, 'files', 'archive-test.moe-archive'), 'utf8')

test('stringify file', async t => {
  t.is(archive.stringify(testJson.data, testJson.structure, { pretty: false }), testArchive)
  
  t.is(archive.stringify(testJson.data, testJson.structure, { pretty: true }), testArchivePretty)
})

test('parse data', async t => {
  t.deepEqual(archive.parse(testArchive), testJson)

  t.deepEqual(archive.parse(testArchivePretty), testJson)
})