const Listr = require('listr')

const fs = require('fs-extra')
const path = require('path')
const moe = require('../../src')
const config = moe.config
const yaml = require('js-yaml')
const cloneDeep = require('lodash.clonedeep')
const trash = require('trash')

module.exports = new Listr([
  { title: 'Get duplicates',
    async task(ctx) {
      if (await fs.pathExists('.duplicates.yml') === false) throw Error('No duplicates file found')

      ctx.dupes = yaml.safeLoad(await fs.readFile('.duplicates.yml', 'utf8'))
  } },

  { title: 'Sort duplicates',
    async task(ctx) {

      let files = {}
      
      for (let hash in ctx.dupes) {
        if (ctx.verbose) ctx.output = hash

        let dupes = cloneDeep(ctx.dupes[hash])

        await Promise.all(dupes.map(async (file) => {
          file.time = (await fs.stat(file.path)).atimeMs
        }))
        dupes.sort((a, b) => {
          a.time - b.time
        })
        dupes.shift() // remove the oldest version
        
        files[hash] = dupes
      }

      ctx.files = files

      //await fs.writeFile('.duplicates.tmp.json', JSON.stringify(ctx.files, null, '\t'), 'utf8')
  } },

  { title: 'Clean duplicates',
    async task(ctx) {
      for (let hash in ctx.files) {
        for (let file of ctx.files[hash]) {
          if (ctx.verbose) ctx.output = `Deleting ${hash} - ${file.path}`

          await trash(file.path, { glob: false })
        }
      }
  } }
])