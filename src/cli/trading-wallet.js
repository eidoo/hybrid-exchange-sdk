const TWS_COMMAND_DIR = 'trading-wallet'

module.exports = {
  command: 'trading-wallet <command>',
  describe: 'Manage trading wallet service',
  builder: yargs => yargs.commandDir(TWS_COMMAND_DIR),
}
