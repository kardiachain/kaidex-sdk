# Introduction
KaiDex SDK is a javascript library designed to help interact with KaiDex. 
It provides tools and utilities to convert clients' input params into KaiDex's smart contract compatible arguments. 
From which developers can freely build their own applications on top of KaiDex.

# I. Install

## npm

```bash
  npm install kaidex-sdk
```

## yarn

```bash
  yarn add kaidex-sdk
```

## From source
```bash
  npm install https://github.com/kardiachain/kaidex-sdk
```

# II. Usage

## Quick start:
Initially, please provide required endpoints for all the KaiDex smart contracts:

Constructor params: [KaidexOptions](#kaidex-options)

```ts
import KaidexClient from 'kaidex-sdk';

const kaidexClient = new KaidexClient({
    smcAddresses: {
        router: ROUTER_SMC_ADDRESS,
        limitOrder: LIMIT_ORDER_SMC_ADDRESS,
        factory: FACTORY_SMC_ADDRESS,
        wkai: WKAI_SMC_ADDRESS
    },
    rpcEndpoint: RPC_ENDPOINT
})
```


## 2.1 Transactions:
To create transactions in KaiDex SMC, please provide required input-parameters for each method.
The client will return processed data, including methodName, arguments, KaiAmount,
which is then used to interact with corresponding ABI via kaidexClient.invokeSMC() method.

### *Invoke SMC: kaidexClient.invokeSMC()*
* params: [SMCParams.InvokeSMC](#smcparams)

### *Add liquidity: kaidexClient.addLiquidityCallParameters()*
* params: [InputParams.AddLiquidity](#inputparams)
* returns: [SMCParams.CallParams](#smcparams)
* Example:
```ts
const { methodName, args, amount } = kaidexClient.addLiquidityCallParameters({
    inputAmount,
    outputAmount,
    tokenA,
    tokenB,
    walletAddress,
    slippageTolerance,
    txDeadline
})

const txResponse = await kaidexClient.invokeSMC({
    abi: kaidexClient.abis.router,
    smcAddr: kaidexClient.smcAddresses.router,
    methodName: methodName,
    params: args,
    amount: amount
})
```


### *Remove liquidity: kaidexClient.removeLiquidityCallParameters()*
* params: [InputParams.RemoveLiquidity](#inputparams)
* returns: [SMCParams.CallParams](#smcparams)
* Example:
```ts
const { methodName, args, amount } = await kaidexClient.removeLiquidityCallParameters({
    pair,
    withdrawAmount,
    walletAddress,
    slippageTolerance,
    txDeadline,
})

const txResponse = await kaidexClient.invokeSMC({
    abi: kaidexClient.abis.router,
    smcAddr: kaidexClient.smcAddresses.router,
    methodName: methodName,
    amount: amount,
    params: args
})
```


### *Swap tokens: kaidexClient.marketSwapCallParameters*
* params: [InputParams.MarketSwap](#inputparams)
* returns: [SMCParams.CallParams](#smcparams)
* Example:
```ts
const { methodName, args, amount } = kaidexClient.marketSwapCallParameters({
    amountIn,
    amountOut,
    inputToken,
    outputToken,
    addressTo,
    inputType,
    txDeadline,
    slippageTolerance
})

const txResponse = await kaidexClient.invokeSMC({
    abi: this.abis.router,
    smcAddr: this.smcAddresses.router,
    methodName,
    amount,
    params: args
})
```

## 2.2 Utils:
### *Get token balance: kaidexClient.getTokenBalance()*
* params:
```ts
tokenAddress: string
walletAddress: string
```
```ts
const tokenBalance = await kaidexClient.getTokenBalance(tokenAddress, walletAddress)
```

### *Check token's approval state: kaidexClient.getApprovalState()*
* params:
```ts
tokenAddr: string;
decimals: number;
walletAddress: string;
spenderAddress: string;
amountToCheck: number | string;
```
```ts
const isApproved = await kaidexClient.getApprovalState({
    tokenAddr,
    decimals,
    walletAddress, 
    spenderAddress,
    amountToCheck
})
```


### *Check price impact: kaidexClient.calculatePriceImpact()*
* params: [InputParams.CalculatePriceImpact](#inputparams)
```ts
const priceImpact = await kaidexClient.calculatePriceImpact(inputToken, outputToken, amountIn, amountOut)
```

### *Check pair's reserves: kaidexClient.getReverses()*
* params:
```ts
tokenA: string
tokenB: string
```
```ts
const { reserveA, reserveB } = await kaidexClient.getReverses(tokenA, tokenB)
```

### *Calculate output amount: kaidexClient.calculateOutputAmount()*
* params: [InputParams.CalculateOutputAmount](#inputparams)

```ts
const outputAmount = await kaidexClient.calculateOutputAmount(amount, inputToken, outputToken, inputType)
```

# III. Types:
## Usage
```ts
import {
    KaidexOptions,
    Token,
    PooledTokens,
    LiquidityPair,
    SMCParams,
    InputParams
} from 'kaidex-sdk'
```

## Kaidex Options
```ts
interface KaidexOptions {
    rpcEndpoint?: string;
    abis?: ABIS;
    smcAddresses?: SmcAddresses;
}

interface ABIS {
    factory?: any;
    krc20?: any;
    limitOrder?: any;
    router?: any;
}

interface SmcAddresses {
    router?: string;
    factory?: string;
    limitOrder?: string;
    wkai?: string;
}
```

## Token and pair
```ts
interface Token {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface PooledTokens {
  reserveA: string;
  reserveB: string;
}

interface LiquidityPair {
    balance: string;
    name: string;
    pairAddress: string;
    tokenA: Token;
    tokenB: Token;
    provider: string;
    pooledTokens: PooledTokens;
}
```

## Enum
```ts
enum TradeType {
    BUY = 0,
    SELL = 1,
}

enum InputType {
    EXACT_IN = 0,
    EXACT_OUT = 1,
}
```

## SMCParams
```ts
namespace SMCParams {
  interface CallParams {
    methodName: string;
    args: (string | string[] | number)[];
    amount?: number | string;
  }

  interface InvokeParams {
    abi: any;
    smcAddr: string;
    methodName: string;
    params: (string | string[] | number)[];
    amount?: number;
    gasLimit?: number;
    gasPrice?: number;
  }
}
```

## InputParams
```ts
namespace InputParams {
    interface CalculateOutputAmount {
        amount: number | string;
        inputToken: Token;
        outputToken: Token;
        inputType: InputType;
    }

    interface CalculatePriceImpact {
        inputToken: Token;
        outputToken: Token;
        amountIn: string;
        amountOut: string;
    }

    interface AddLiquidity {
        inputAmount: string | number;
        outputAmount: string | number;
        tokenA: Token;
        tokenB: Token;
        walletAddress: string;
        slippageTolerance: string | number;
        txDeadline: number;
    }

    interface RemoveLiquidity {
        pair: LiquidityPair;
        withdrawAmount: string;
        walletAddress: string;
        slippageTolerance: string | number;
        txDeadline: number;
    }

    interface MarketSwap {
        amountIn: string;
        amountOut: string;
        inputToken: Token;
        outputToken: Token;
        addressTo: string;
        inputType: InputType;
        txDeadline: number;
        slippageTolerance: string | number;
    }
}
```
