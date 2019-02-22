const logger = require('../../logger')

const { getTradingWalletBalanceCommand } = require('../../commands/commandList')

module.exports = {
  describe: getTradingWalletBalanceCommand.constructor.description,
  builder: getTradingWalletBalanceCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getTradingWalletBalanceCommand.executeAsync(argv)),
}
