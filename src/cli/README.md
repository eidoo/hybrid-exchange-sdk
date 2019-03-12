# <img src="logo.svg" alt="OpenZeppelin" width="400px">

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/eidoo/hybrid-exchange-sdk/issues)
[![CircleCI](https://circleci.com/gh/eidoo/hybrid-exchange-sdk/tree/dev.svg?style=svg)](https://circleci.com/gh/eidoo/hybrid-exchange-sdk/tree/dev)

The SDK package put at your disposal its functionalities through a **CLI** (command line interface).

You can install it globallly with:

```bash
yarn global add eidoo/hybrid-exchange-sdk
```

or

```bash
npm install -g eidoo/hybrid-exchange-sdk
```

and access to it with:

```bash
hybrid-exchange-cli <domain> <command> <options>
```

The CLI has been designed in four macro domains:
- [ethereum wallet](#Ethereum-wallet)
- [order](#Order)
- [token](#Token)
- [trading wallet](#Trading-wallet)

For release notes, please see the [CHANGELOG](../../CHANGELOG.md).

# Ethereum wallet
The ethereum wallet functionality let you create a keystore from a specific ethereum account.<br>
A keystore file is a JSON file that encrypts your ethereum account using a password.

Command:<br>
```bash
hybrid-exchange-cli ethereum-wallet keystore-generate
```

Args:<br>
- `--keystore-file-path` Destination path of the generated keystore <br>
- `--hd-path [default: m/44'/60'/0/0]` The path for ethereum account derivation

# Order
The order functionalities let you *create*, *cancel* and *sign* orders to the Eidoo hybrid exchange.

## Create
Submit an order creation to the Eidoo hybrid exchange.

Command:<br>
```bash
hybrid-exchange-cli order create
```

Args:<br>
- `--cli-input-json` Order JSON <br>
- `--keystore-file-path` The path of your keystore

You can find an order JSON sample [here](../../examples/lib/orders/createOrder.js).<br>
Remember that it needs to be stringify: `'{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e"...}'`

The command returns the orderId.

## Cancel order
Submit an order cancel to the Eidoo hybrid exchange.

Command:<br>
```bash
hybrid-exchange-cli order cancel
```

Args:<br>
- `--order-id` The orderId<br>
- `--keystore-file-path` The path of your keystore

## Sign order
The create order command is automatically adding to the passed order object an `ecSignature` field if not provided.<br>
The `ecSignature` field can be manually generated and so later added to the order object using the `sign command`.

Command:<br>
```bash
hybrid-exchange-cli order sign
```

Args:<br>
- `--cli-input-json` Order JSON <br>
- `--keystore-file-path` The path of your keystore

You can find an order JSON sample [here](../../examples/lib/orders/createOrder.js).<br>
Remember that it needs to be stringify: `'{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e"...}'`

The command returns the `ecSignature` value.

# Token
The token functionalities let you interact with ERC20 tokens.

## Approve
It execute an ERC20 token approve method.

Command:<br>
```bash
hybrid-exchange-cli token approve
```

Args:<br>
- `--from` The token holder public key<br>
- `--to` The token address<br>
- `--quantity` The amount to be approved<br>
- `--spender` The spender account public key<br>
- `--keystore-file-path` The path of your keystore

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.

## Allowance
It retrieves the ERC20 allowance property value.

Command:<br>
```bash
hybrid-exchange-cli token get-allowance
```

Args:<br>
- `--owner` The token holder public key<br>
- `--spender` The spender account public key<br>
- `--token` The token address

Optional
- `--draft` It will not execute the transaction but will return the transaction object

It returns the allowed amount in WEI.

# Trading wallet
The trading wallet functionalities let you *create* and manage your trading wallet smart contract by *deposit* and *withdraw* funds.<br>
You can also retrieve your trading wallet address and funds balances.

## Create wallet
It creates a trading wallet instance.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet create-wallet
```

Args:<br>
- `--eoa` The personal wallet address<br>
- `--keystore-file-path` The spender account public key

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.

## Get trading wallet address
It retrieves the address of the trading wallet connected to the specified personal wallet address.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet get-address
```

Args:<br>
- `--eoa` The personal wallet address

Optional
- `--draft` It will not execute the transaction but will return the transaction object

It returns the trading wallet address.

## Deposit ether
It deposits a specified amount of ETH to your trading wallet.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet deposit-eth
```

Args:<br>
- `--from` The personal wallet address<br>
- `--to` The trading wallet<br>
- `--quantity` The amount of ETH in WEI<br>
- `--keystore-file-path` The path of your keystore

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.

## Deposit token
It deposits a specified amount of an ERC20 token to your trading wallet.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet deposit-token
```

Args:<br>
- `--from` The personal wallet address<br>
- `--to` The trading wallet<br>
- `--quantity` The amount of the token in WEI<br>
- `--token` The token address<br>
- `--keystore-file-path` The path of your keystore

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.

## Get trading wallet asset balance
It retrieves the asset balance of a trading wallet.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet get-balance
```

Args:<br>
- `--from` The personal wallet address<br>
- `--to` The trading wallet address<br>
- `--token` The asset address

Optional
- `--draft` It will not execute the transaction but will return the transaction object

It returns the asset balance in WEI.

## Withdraw
It withdraws a specified amount of a specified asset from your trading wallet.

Command:<br>
```bash
hybrid-exchange-cli trading-wallet withdraw
```

Args:<br>
- `--from` The personal wallet address<br>
- `--to` The trading wallet<br>
- `--quantity` The amount of the asset in WEI<br>
- `--token` The asset address (`0x0000000000000000000000000000000000000000` for ETH)<br>
- `--keystore-file-path` The path of your keystore

Optional
- `--draft` It will not execute the transaction but will return the transaction object<br>
- `--raw-tx` It will not execute the transaction but will return the signed raw transaction

It returns the transaction hash.