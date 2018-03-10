const hash = require('../src/hash')
const path = require('path')
const test = require('ava')

const testFile = path.join(__dirname, 'files', 'ZeroTwo.jpg')

test('hash file', async t => {
  t.is(await hash(testFile, 'md5'), 'b26022cfe0f68a568cd3cbf6c5dc6a99')
  t.is(await hash(testFile, 'sha1'), '4e73b97e55b708b5361545b5e29a8345e6608659')
})