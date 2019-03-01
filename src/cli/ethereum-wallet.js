const ETHEREUM_WALLET_COMMAND_DIR = 'ethereum-wallet'

module.exports = {
  command: 'ethereum-wallet <command>',
  describe: 'Manage ethereum wallet',
  builder: yargs => yargs.commandDir(ETHEREUM_WALLET_COMMAND_DIR),
}
