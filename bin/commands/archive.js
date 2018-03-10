const fs = require('fs-extra-promise')
const Listr = require('listr')
const path = require('path')
const moe = require('../../src')
const config = moe.config

module.exports = function(program){

  program
    .command('archive')
    .description('Create an archive of the current directory')
    .option('-d, --depth <n>', 'recursive depth', parseInt, 5)
    .option('-p, --pretty', 'pretty archive file, slower')
    .action(async function(opts) {
      const list = new Listr([
        { title: 'Read file structure', 
          async task(ctx) {
            ctx.files = await moe.walk(process.cwd(), opts.depth, (file) => {
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
          async task(ctx) {
            let fileData = []
            for (let file of ctx.files) {
              fileData.push({
                path: file,
                hash: await moe.hash(file, config.get('algorithm')),
                tags: []
              })
            }
            ctx.files = fileData
        } },

        { title: 'Create archive data',
          async task(ctx) {
            ctx.archiveData = moe.archive.stringify(
              ctx.files, 
              { 
                algorithm: config.get('algorithm'), 
                depth: opts.depth 
              }, 
              { 
                pretty: opts.pretty 
              }
            )
        } },

        { title: 'Write .moe-archive',
          async task(ctx) {
            await fs.writeFileAsync('.moe-archive', ctx.archiveData, 'utf8')
        } }
      ])

      list.run().catch(err => {
        throw err
      })    
   })

}