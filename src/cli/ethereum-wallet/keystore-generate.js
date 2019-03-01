const logger = require('../../logger')

const { keyStoreGenerateCommand } = require('../../commands/commandList')

module.exports = {
  describe: keyStoreGenerateCommand.constructor.description,
  builder: keyStoreGenerateCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await keyStoreGenerateCommand.executeAsync(argv)),
}
