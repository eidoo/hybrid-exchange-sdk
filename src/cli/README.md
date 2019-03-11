# <img src="logo.svg" alt="OpenZeppelin" width="400px">

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/eidoo/hybrid-exchange-sdk/issues)
[![CircleCI](https://circleci.com/gh/eidoo/hybrid-exchange-sdk/tree/dev.svg?style=svg)](https://circleci.com/gh/eidoo/hybrid-exchange-sdk/tree/dev)

After the installation the SDK will put at your disposal its functionalities through a CLI (command line interface).

The CLI has been designed in 4 macro functionalities:
- [ethereum wallet]()
- [order]()
- [token]()
- [trading wallet]()

You can check every command documentation at any time by simply typing: `yarn hybrid-exchange-cli --help`

## Ethereum wallet
The ethereum wallet functionality let you create a keystore from a specific ethereum account.<br>
A keystore file is a JSON file that encrypts your ethereum account using a password.

Command:<br>
- `yarn hybrid-exchange-cli ethereum-wallet keystore-generate`

Args:<br>
- `--keystore-file-path` Destination path of the generated keystore <br>
- `--hd-path [default: m/44'/60'/0/0]` The path for ethereum account derivation

## Order
The order functionalities let you *create*, *cancel* and *sign* orders to the Eidoo hybrid exchange.

### Create
Submit an order creation to the Eidoo hybrid exchange.

Command:<br>
- `yarn hybrid-exchange-cli order create`

Args:<br>
- `--cli-input-json` Order JSON <br>
- `--keystore-file-path` The path of your keystore

You can find an order JSON sample [here](../../examples/lib/orders/createOrder.js).<br>
Remember that it needs to be stringify: `'{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e"...}'`

The command returns the orderId.

### Cancel order
Submit an order cancel to the Eidoo hybrid exchange.

Command:<br>
- `yarn hybrid-exchange-cli order cancel`

Args:<br>
- `--order-id` The orderId<br>
- `--keystore-file-path` The path of your keystore

### Sign order
The create order command is automatically adding to the passed order object an `ecSignature` field if not provided.<br>
The `ecSignature` field can be manually generated and so later added to the order object using the `sign command`.

Command:<br>
- `yarn hybrid-exchange-cli order sign`

Args:<br>
- `--cli-input-json` Order JSON <br>
- `--keystore-file-path` The path of your keystore

You can find an order JSON sample [here](../../examples/lib/orders/createOrder.js).<br>
Remember that it needs to be stringify: `'{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e"...}'`

The command returns the `ecSignature` value.

## Token
The token functionalities let you interact with ERC20 tokens.

### Approve
It execute an ERC20 token approve method.

Command:<br>
- `yarn hybrid-exchange-cli token approve`

Args:<br>
- `--from` The token holder public key<br>
- `--to` The token address<br>
- `--quantity` The amount to be approved<br>
- `--spender` The spender account public key<br>
- `--keystore-file-path` The path of your keystore<br>

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.

### Allowance
It retrieves the ERC20 allowance property value.

Command:<br>
- `yarn hybrid-exchange-cli token get-allowance`

Args:<br>
- `--owner` The token holder public key<br>
- `--spender` The spender account public key<br>
- `--token` The token address

Optional
- `--draft` It will not execute the transaction but will return the transaction object

It returns the allowed amount in WEI.