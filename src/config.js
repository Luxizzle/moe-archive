const Conf = require('conf')

const defaultConfig = {
  algorithm: 'md5',
  // small value to prove config is not new
  init: true
}

const config = new Conf({
  configName: 'moe-archive'
})

if (config.has('init') === false) config.store = defaultConfig

module.exports = config