const Conf = require('conf')

const defaultConfig = {
  algorithm: 'md5',
  depth: 5
}

const config = new Conf({
  projectName: 'moe-archive'
})

for (let key in defaultConfig) {
  if (!config.has(key)) config.set(key, defaultConfig[key])
}

module.exports = config