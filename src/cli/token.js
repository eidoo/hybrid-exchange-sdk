const TKS_COMMAND_DIR = 'token'

module.exports = {
  command: 'token <command>',
  describe: 'Manage Erc20 token service',
  builder: yargs => yargs.commandDir(TKS_COMMAND_DIR),
}
