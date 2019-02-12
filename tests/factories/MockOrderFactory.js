const { Factory } = require('rosie')

const MockOrderFactory = new Factory()
  .attrs(
    {
      added: 1541597434,
      amountFilled: '112500000000000000',
      amountLocked: '300000000000000000',
      amountPendingConfirmation: '300000000000000000',
      ecSignature: {
        r: '0xb22ac53bdf8e8d1d68bebb02365d276f22824d9682cdb3faae309be8cb902317',
        s: '0x66252cf80ad827209a2a2f8e34862db05a3272d25c637d778108b2a2d6212be4',
        v: 28,
      },
      ethTokenRatio: '0.004',
      exchangeAddress: '0x5bcd707ddb9b9577ac41479e273bffffae255ee5',
      expirationBlock: '1000000000',
      id: '0xa6377b1422117cebfa769b57fe4e5f524486e411ac87d58c36a173c38efe9f63',
      lastUpdated: 1541681549,
      maker: '0xdc551f9288fdab3aaea95ef202178fb105fef28e',
      makerWallet: '0x79dda10e63a08cdf9950fa7a0db4b0402f32beef',
      offerTokenAddress: '0x0000000000000000000000000000000000000000',
      offerTokenAmount: '300000000000000000',
      salt: '64713395210050020386126955043767057479631664086492288156861339271894827521994',
      status: 'unfillable',
      version: 469,
      wantTokenAddress: '0x2b2c319799df9d98b0fd34c961a2e1181239de27',
      wantTokenAmount: '75000000000000000000',
    },
  )

module.exports = MockOrderFactory
