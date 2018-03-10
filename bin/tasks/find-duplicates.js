const Listr = require('listr')

const fs = require('fs-extra')
const path = require('path')
const moe = require('../../src')
const config = moe.config
const yaml = require('js-yaml')

module.exports = new Listr([
  { title: 'Comparing hashes',
    async task(ctx, task) {
      const dupes = {}
      let found = 0

      const files = await moe.archive.get.archive()
      for (let file1 of files) {
        for (let file2 of files) {
          if (file1.path === file2.path) continue

          if (ctx.verbose) task.output = `${file1.hash} & ${file2.hash}`

          if (file1.hash === file2.hash) {
            found++
            dupes[file1.hash] = dupes[file1.hash] || []
            dupes[file1.hash].push(file2)
          }
        }
      }

      ctx.found = found
      ctx.dupes = dupes
  } },

  { title: 'Finish task',
    async task(ctx, task) {
      if (ctx.found > 0) {
        ctx.output = 'Writing .duplicates.yml'
        await fs.writeFile('.duplicates.yml', yaml.safeDump(ctx.dupes, {
          noRefs: true
        }), 'utf8')

        task.title = `${ctx.found} duplicates found > .duplicates.yml`
      } else {
        task.title = `${task.title} - No duplicates found`
      }
  } }
])