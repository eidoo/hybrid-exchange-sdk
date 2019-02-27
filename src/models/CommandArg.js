class CommandArg {
  constructor (name, type, alias, describe, nargs, demand, defaultValue = undefined, coerce = {}) {
    this.name = name
    this.type = type
    this.alias = alias
    this.describe = describe
    this.nargs = nargs
    this.demand = demand
    this.default = defaultValue
    this.coerce = coerce
  }

  getArgProps() {
    return {
      type: this.type,
      alias: this.alias,
      describe: this.describe,
      nargs: this.nargs,
      demand: this.demand,
      default: this.default,
    }
  }

  getReprForSynopsys() {
    if (this.demand) {
      return ` <${this.name}>`
    }
    return ` [${this.name}]`
  }
}

module.exports = CommandArg
