const logger = require('../../logger')

const { createWalletCommand } = require('../../commands/commandList')

module.exports = {
  describe: createWalletCommand.constructor.description,
  builder: createWalletCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await createWalletCommand.executeAsync(argv)),
}
