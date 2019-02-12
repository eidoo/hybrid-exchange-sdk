const yargs = require('yargs')

const { cliVersion } = require('../../package.json')

const COMMAND_DIR = './'

// eslint-disable-next-line
const run = () => yargs
  .version(cliVersion)
  .commandDir(COMMAND_DIR)
  .demandCommand()
  .help()
  .argv

module.exports = run
