# <img src="logo.svg" alt="OpenZeppelin" width="400px">
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/eidoo/hybrid-exchange-sdk/issues)

The official **EIDOO HYBRID EXCHANGE SDK** for Node.js.<br>
Learn more about [Eidoo](https://eidoo.io/hybrid-crypto-exchange/) and the [Eidoo Hybrid Exchange APIs](https://docs.api.eidoo.io/).

This project is designed to make the interaction with **Eidoo Hybrid Exchange** easier.<br>
You will be able to:
  - create a trading wallet smart contract,
  - deposit and withdraw funds from a trading wallet,  withdraw from trading wallet,
  - list, create and delete orders,
  - retrieve order book informations

For release notes, please see the [CHANGELOG](./CHANGELOG.md).


## Installation
If you want you can install it with npm:

```bash
npm install --save eidoo/hybrid-exchange-sdk
 ```

or if you prefer using yarn:

```bash
yarn add eidoo/hybrid-exchange-sdk
 ```

Then within your application, you can reference SDK with the following:

```javascript
const hybridExchangeSdk = require('@eidoo/hybrid-exchange-sdk')
```

## Quick start
To interact with the Eidoo hybrid exchange and submit an order based on what you would like to trade you need to check the [available pairs](./examples/lib/pair/listPair.js).<br>
Once you have chosen the pair you can retrieve the associated [order book](./examples/lib/pair/getOrderBook.js) and eventually check the related EDO pair [fee](./examples/lib/pair/getOrderBook.js).<br>

As soon as you are ready you need a funded ethereum wallet address.

The first step to place an order is the creation of a **trading wallet**.<br>
The trading wallet is a smart contract connected to your ethereum wallet address.<br>
You can [create](./examples/lib/tradingWallet/createWallet/createWallet.js) it using the SDK.<br>
If you already have a trading wallet connected to your ethereum wallet you can also just [retrieve its address](./examples/lib/tradingWallet/getAddress/getAddress.js).

You can manage the trading wallet by depositing and withdrawing funds.
You can deposit both [ether](./examples/lib/tradingWallet/depositEth/depositEther.js) and [ERC20 token](./examples/lib/tradingWallet/depositToken/depositToken.js).<br>

In order to deposit the above assets your ethereum wallet needs to be funded.<br>

Please note that as soon as you are ready to deposit some ERC20 token you must [approve](./examples/lib/tradingWallet/approve/approve.js) your trading wallet as spender of the deposit amount since the trading wallet will perform a `transferFrom` of the token from your ethereum wallet to itself.<br>
You can check the status of the approval verifying the [allowance](./examples/lib/tradingWallet/allowance/getAllowance.js).

You will always be the only one able to withdraw [ERC20 token](./examples/lib/tradingWallet/withdraw/withdraw.js) and [ether](./examples/lib/tradingWallet/withdraw/withdraw.js) from your trading wallet to the connected ethereum wallet.

Once you have your trading wallet funded you can [create an order](./examples/lib/orders/createOrder.js) on Eidoo exchange and eventually retrieve the [list of the orders](./examples/lib/orders/listOrders.js) you have already created.<br>
You will also be able to retrieve the [single order](./examples/lib/orders/getOrder.js) information.

If you are not satisfied by the order you have just created you are able to [cancel](./examples/lib/orders/cancelOrder.js) it as soon as it is still in the order book and did not find any match.

## Build and Sign transaction
Using the SDK you are able to build and sign transactions before submitting them to the Eidoo exchange.

Suppose you would like to create a trading wallet specifying some transaction object values like the GAS, GASPRICE and NONCE.<br>
You could [build the transaction](./examples/lib/tradingWallet/createWallet/buildCreateWallet.js) getting the transaction object draft without any NONCE and GAS values.<br>
After that you can [sign](./examples/lib/tradingWallet/createWallet/signCreateWallet.js) the transaction obeject setting your favorite GAS, GASPRICE and NONCE values and then [execute](./examples/lib/tradingWallet/createWallet/executeCreateWallet.js) the transaction manually.

## Build and Sign an order manually
You can create and cancel an order without building and signing the order, but if you would like to do it manually you have to [build](./examples/lib/orders/buildOrderCreate.js) and [sign](./examples/lib/orders/signOrderCreate.js) the order before submitting them to the Eidoo exchange.

## Opening Issues
If you encounter a bug in the **EIDOO HYBRID EXCHANGE SDK** please check the [existing issues](https://github.com/eidoo/hybrid-exchange-sdk/issues) and try to make sure your problem doesn’t already exist before opening a new issue. Please include the version of the SDK you are using and all the relevant information to reproduce the bug.


## License
This SDK is distributed under the
[MIT](./LICENSE),
see LICENSE for more information.