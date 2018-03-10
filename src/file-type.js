const fileType = require('file-type')
const fs = require('fs')

const config = require('./config')

module.exports = function(file) {
  return new Promise((resolve, reject) => {
    if (!file) throw new Error('Need a file')

    fs.readFile(file, (err, fileBuffer) => {
      if (err) return reject(err)

      resolve(fileType(fileBuffer))
    })
  })
}