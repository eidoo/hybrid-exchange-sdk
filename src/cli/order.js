const OS_COMMAND_DIR = 'order'

module.exports = {
  command: 'order <command>',
  describe: 'Manage order service',
  builder: yargs => yargs.commandDir(OS_COMMAND_DIR),
}
