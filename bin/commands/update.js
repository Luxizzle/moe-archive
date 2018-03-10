const updateTask = require('../tasks/update')

const config = require('../../src/config')

const Listr = require('listr')

module.exports = function(program){

  program
    .command('update')
      .alias('archive')
      .alias('u')
    .description('Update or create an archive of the current directory')
    .option('-d, --depth <n>', 'recursive depth', parseInt, config.get('depth'))
    .option('-p, --pretty', 'pretty archive file, slower')
    .option('-v, --verbose', 'verbose output')
    .action(async function(opts) {
      const task = new Listr([
        { title: 'Update archive', 
        task() {
          return updateTask
        } }
      ], { collapse: false })

      task.run(opts)
   })

}