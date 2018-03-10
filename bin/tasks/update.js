const fs = require('fs-extra')
const Listr = require('listr')
const path = require('path')
const moe = require('../../src')
const config = moe.config

module.exports = new Listr([
  { title: 'Read file structure', 
    async task(ctx, task) {
      task.title = `${task.title} (depth: ${ctx.depth})`

      ctx.files = await moe.walk(process.cwd(), ctx.depth, (file, fullPath) => {
        if (ctx.verbose) task.output = path.relative(process.cwd(), fullPath)
        
        if (file.startsWith('.')) return false

        switch(file) {
          case 'node_modules':
            return false
          default: 
            return true
        }
      })
  } },

  { title: 'Create data structure',
    async task(ctx, task) {
      let fileData = []
      for (let file of ctx.files) {
        if (ctx.verbose) task.output = `${fileData.length}/${ctx.files.length} - ${file}`

        let original = await moe.archive.get.byPath(null, file)

        let stat = await fs.stat(file)

        fileData.push({
          path: file,
          size: stat.size,
          hash: await moe.hash(file, config.get('algorithm')),
          tags: original ? original.tags : []
        })
      }

      fileData.sort((a, b) => b.size - a.size)
      ctx.files = fileData
  } },

  { title: 'Create archive data',
    async task(ctx) {
      ctx.archiveData = await moe.archive.stringify(
        ctx.files, 
        { 
          algorithm: config.get('algorithm')
        }, 
        { 
          pretty: ctx.pretty 
        }
      )
  } },

  { title: 'Write .moe-archive',
    async task(ctx) {
      await fs.writeFile('.moe-archive', ctx.archiveData, 'utf8')
  } }
])