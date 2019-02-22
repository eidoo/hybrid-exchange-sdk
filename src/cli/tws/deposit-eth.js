const logger = require('../../logger')

const { depositEthCommand } = require('../../commands/commandList')

module.exports = {
  describe: depositEthCommand.constructor.description,
  builder: depositEthCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await depositEthCommand.executeAsync(argv)),
}
