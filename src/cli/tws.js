const TWS_COMMAND_DIR = 'tws'

module.exports = {
  command: 'tws <command>',
  describe: 'Manage trading wallet service',
  builder: yargs => yargs.commandDir(TWS_COMMAND_DIR),
}
