/*
STRUCTURE
---
DATA
*/

/*
{ "algorithm": "md5" }
---
path | hash | tags
...
*/

const yaml = require('js-yaml')
const stringWidth = require('string-width')
const cloneDeep = require('lodash.clonedeep')

module.exports = function stringify(data, structure, opts = {}) {
  opts = Object.assign({
    pretty: false // make the file more readable
  }, opts)

  data = cloneDeep(data)

  let fileLength = 0
  let hashLength = 0

  if (opts.pretty) {
    data.forEach((line) => {
      fileLength = Math.max(fileLength, stringWidth(line.path))
      hashLength = Math.max(hashLength, stringWidth(line.hash))
    })

    data.forEach((line) => {
      line.path = line.path + (' '.repeat(fileLength - stringWidth(line.path)))
      line.hash = line.hash + (' '.repeat(hashLength - stringWidth(line.hash)))
    })
  }
  

  let str = ''
  str += yaml.safeDump(structure)//JSON.stringify(structure, null, opts.pretty === true ? '\t' : undefined) + '\n'
  str += '---\n'
  str += data.map((line) => {
    const tags = line.tags.join(opts.pretty ? ', ' : ',')
    return [
      line.path, 
      line.hash, 
      tags
    ].join(opts.pretty ? ' | ' : '|')
  }).join('\n')

  return str
}