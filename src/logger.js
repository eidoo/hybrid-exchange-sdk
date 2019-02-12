const bunyan = require('bunyan')
const dotenv = require('dotenv')

dotenv.config()
let level = 'fatal'

if (process.env.ENABLE_LOG) {
  level = 'debug'
}

const logSetting = {
  name: 'hybrid-exchange-sdk',
  serializers: bunyan.stdSerializers,
  streams: [{
    stream: process.stdout,
    level,
  }],
}

const logger = bunyan.createLogger(logSetting)

logger.show = message => console.log(message)

module.exports = logger
