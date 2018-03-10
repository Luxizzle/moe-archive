const hasha = require('hasha')

const config = require('./config')

module.exports = function(
  file, 
  algorithm = config.get('algorithm')
) {
  if (!file) throw new Error('Need a file')

  return hasha.fromFile(file, {
    algorithm, encoding: 'hex'
  })
}
