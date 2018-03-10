const updateTask = require('../tasks/update')
const duplicateTask = require('../tasks/find-duplicates')

const config = require('../../src/config')

const Listr = require('listr')

module.exports = function(program) {

  program
    .command('find-duplicates')
      .alias('duplicates')
      .alias('fd')
    .description('Find duplicate files')
    .option('-d, --depth <n>', 'recursive depth', parseInt, config.get('depth'))
    .option('-p, --pretty', 'pretty archive file, slower')
    .option('-v, --verbose', 'verbose output')
    .option('-s, --skip', 'Skip updating archive')
    .action(function(opts) {
      const task = new Listr([
        { title: 'Update archive',
          skip: (ctx) => ctx.skip,
          task() {
            return updateTask
        } },

        { title: 'Find duplicates',
          task() {
            return duplicateTask
        } }
      ], { collapse: false })

      task.run(opts)
    })
}