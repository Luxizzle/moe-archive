const updateTask = require('../tasks/update')
const duplicateTask = require('../tasks/find-duplicates')
const cleanTask = require('../tasks/cleanup')

const config = require('../../src/config')

const Listr = require('listr')

function parseIntStrict(integer) {
  return /^-?\d+$/.test(integer) ? parseInt(integer, 10) : undefined
}

module.exports = function(program) {

  program
    .command('cleanup')
      .alias('clean')
      .alias('c')
    .description('Find duplicate files')
    .option('-d, --depth <n>', 'recursive depth', parseIntStrict, config.get('depth'))
    .option('-p, --pretty', 'pretty archive file, slower')
    .option('-v, --verbose', 'verbose output')
    .option('-s, --skip', 'Skip updating archive and duplicates')
    .action(function(opts) {
      const task = new Listr([
        { title: 'Update archive',
          skip: (ctx) => ctx.skip,
          task() {
            return updateTask
        } },

        { title: 'Find duplicates',
          skip: (ctx) => ctx.skip,
          task() {
            return duplicateTask
        } },

        { title: 'Cleanup',
          skip: (ctx) => ctx.found === 0,
          task() {
            return cleanTask
        } }
      ], { collapse: false })

      task.run(opts)
    })
}