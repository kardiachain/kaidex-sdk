Javascript library to interact with KaiDex.

## Install

### npm

```bash
  npm install kaidex-sdk
```

### yarn

```bash
  yarn add kaidex-sdk
```

### From source
```bash
  npm install https://github.com/kardiachain/kaidex-sdk
```


## Usage
```js
import KaidexClient from 'kaidex-sdk';

const kaidexClient = new KaidexClient({
    smcAddresses: {
        router: ROUTER_SMC_ADDRESS,
        limitOrder: LIMIT_ORDER_SMC_ADDRESS,
        factory: FACTORY_SMC_ADDRESS,
        wkai: WKAI_SMC_ADDRESS
    },
    rpcEndpoint: ''
})

// Add liquidity
const { methodName, args, amount } = kaidexClient.addLiquidityCallParameters({
    inputAmount: string | number,
    outputAmount: string | number,
    tokenA: Token,
    tokenB: Token,
    walletAddress: string,
    slippageTolerance: string | number,
    txDeadline: number
})

// Remove liquidity
const { methodName, args, amount } = kaidexClient.removeLiquidityCallParameters({
    pair: MyLiquidityPair,
    withdrawPercent: string | number,
    walletAddress: string,
    slippageTolerance: string | number,
    txDeadline: number,
})

// Swap tokens
const { methodName, args, amount } = kaidexClient.marketSwapCallParameters({
    amountIn: string,
    amountOut: string,
    inputToken: Token,
    outputToken: Token,
    addressTo: string,
    inputType: InputType,
    txDeadline: number,
    slippageTolerance: string | number
})

// Utils:
const tokenBalance = kaidexClient.getTokenBalance(tokenAddress, walletAddress)
const isApproved = kaidexClient.getApprovalState(tokenAddr, walletAddress, spenderAddress, amountToCheck)

const priceImpact = kaidexClient.calculatePriceImpact(inputToken, outputToken, amountIn, amountOut)
const { rateAB, rateBA } = kaidexClient.calculateExchangeRate(tokenA, tokenB)
const outputAmount = kaidexClient.calculateOutputAmount(amount, inputToken, outputToken, inputType)
```
