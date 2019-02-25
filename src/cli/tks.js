const TKS_COMMAND_DIR = 'tks'

module.exports = {
  command: 'tks <command>',
  describe: 'Manage Erc20 token service',
  builder: yargs => yargs.commandDir(TKS_COMMAND_DIR),
}
