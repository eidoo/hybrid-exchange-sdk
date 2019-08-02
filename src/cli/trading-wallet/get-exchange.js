const logger = require('../../logger')

const { getExchangeCommand } = require('../../commands/commandList')

module.exports = {
  describe: getExchangeCommand.constructor.description,
  builder: getExchangeCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getExchangeCommand.executeAsync(argv)),
}
