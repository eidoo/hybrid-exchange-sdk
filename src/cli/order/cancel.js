const logger = require('../../logger')

const { orderCancelCommand } = require('../../commands/commandList')

module.exports = {
  describe: orderCancelCommand.constructor.description,
  builder: orderCancelCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await orderCancelCommand.executeAsync(argv)),
}
