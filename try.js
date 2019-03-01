async function promptMnemonic() {
  const inquirer = require('inquirer')
  const { mnemonic } = await inquirer
    .prompt([
      {
        type: 'password',
        message: 'Enter mnemonic',
        name: 'mnemonic',
        mask: '*',
      },
    ])
  console.log(mnemonic)
}

promptMnemonic()
