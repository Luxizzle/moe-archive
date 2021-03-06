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

module.exports = async function parse(str) {
  str = str.trim().split('---')

  let structure = yaml.safeLoad(str[0].trim())// JSON.parse(str[0].trim())

  let data = str[1].trim().split('\n')
    .map((line) => {
      line = line.split('|').map((part) => part.trim())
      return {
        path: line[0].trim(),
        size: parseInt(line[1].trim()),
        hash: line[2].trim(),
        tags: line[3].trim().split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      }
    })

  return {
    structure, data
  }
}