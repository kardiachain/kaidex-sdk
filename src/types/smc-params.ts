declare namespace SMCParams {
  interface CallParams {
    abi: any;
    methodName: string;
    args: (number | string | string[])[];
    amount?: string;
  }

  interface InvokeParams {
    amount?: string;
    gasLimit?: number;
    gasPrice?: number;
    abi: any;
    contractAddr: string;
    methodName: string;
    params: (number | string | string[])[];
  }

  interface SendActionParams {
    abi: any;
    contractAddr: string;
    methodName: string;
    params: any;
    account: Account;
    amount: string;
    gasLimit?: number;
    gasPrice?: number;
  }

  interface AddLiquidity {
    amountADesired: string;
    amountBDesired: string;
    amountAMin: string;
    amountBMin: string;
    tokenA: string;
    tokenB: string;
    address: string;
    deadline: number;
  }

  interface AddLiquidityKAI {
    tokenAddress: string;
    amountTokenMin: string;
    amountTokenDesired: string;
    amountKAI: string;
    amountKAIMin: string;
    address: string;
    deadline: number;
  }

  interface RemoveLiquidity {
    tokenAddressA: string;
    tokenAddressB: string;
    liquidity: string;
    amountAMin: string;
    amountBMin: string;
    walletAddress: string;
    deadline: number;
  }

  interface RemoveLiquidityKAI {
    tokenAddress: string;
    liquidity: string;
    amountTokenMin: string;
    amountKAIMin: string;
    walletAddress: string;
    deadline: number;
  }

  interface OrderInputKAI {
    outputTokenAddr: string;
    outputAmount: string;
    orderType: 0 | 1;
    kaiAmountIn: string;
    tradeType: 0 | 1;
  }

  interface OrderInputTokens {
    inputTokenAddr: string;
    inputAmount: string;
    outputTokenAddr: string;
    outputAmount: string;
    orderType: 0 | 1;
    tradeType: 0 | 1;
  }

  interface CancelOrder {
    pairAddr: string;
    orderID: number;
  }
}
