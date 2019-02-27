const logger = require('../../logger')

const { getAddressCommand } = require('../../commands/commandList')

module.exports = {
  describe: getAddressCommand.constructor.description,
  builder: getAddressCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getAddressCommand.executeAsync(argv)),
}
