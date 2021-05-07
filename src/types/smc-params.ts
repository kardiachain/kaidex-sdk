declare namespace SMCParams {
  interface CallParams {
    methodName: string;
    args: (string | string[])[];
    amount: number | string;
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
