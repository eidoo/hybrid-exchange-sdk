const logger = require('../../logger')

const { orderCreateCommand } = require('../../commands/commandList')

module.exports = {
  describe: orderCreateCommand.constructor.description,
  builder: orderCreateCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await orderCreateCommand.executeAsync(argv)),
}
