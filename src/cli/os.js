const OS_COMMAND_DIR = 'os'

module.exports = {
  command: 'os <command>',
  describe: 'Manage order service',
  builder: yargs => yargs.commandDir(OS_COMMAND_DIR),
}
