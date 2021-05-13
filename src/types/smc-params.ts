export declare namespace SMCParams {
  interface CallParams {
    methodName: string;
    args: (string | string[] | number)[];
    amount?: number | string;
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
    amount?: string;
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
    walletAddress: string;
    deadlineInMilliseconds: number;
  }

  interface AddLiquidityKAI {
    tokenAddress: string;
    amountTokenMin: string;
    amountTokenDesired: string;
    amountKAI: string;
    amountKAIMin: string;
    walletAddress: string;
    deadlineInMilliseconds: number;
  }

  interface RemoveLiquidity {
    tokenA: string;
    tokenB: string;
    liquidity: string;
    amountAMin: string;
    amountBMin: string;
    walletAddress: string;
    deadlineInMilliseconds: number;
  }

  interface RemoveLiquidityKAI {
    tokenAddress: string;
    liquidity: string;
    amountTokenMin: string;
    amountKAIMin: string;
    walletAddress: string;
    deadlineInMilliseconds: number;
  }

  interface SwapParams {
    exactAmount: string;
    path: string[];
    addressTo: string;
    deadlineInMilliseconds: number;
  }

  interface OutputSwapParams extends SwapParams {
    minimumOutputAmountInDecimal: string;
  }

  interface InputSwapParams extends SwapParams {
    maximumInputAmountInDecimal: string;
  }

  interface LimitOrderKAI {
    outputTokenAddr: string;
    outputAmount: string;
    orderType: 0 | 1;
    kaiAmountIn: string;
    tradeType: 0 | 1;
  }

  interface LimitOrder {
    inputTokenAddr: string;
    inputAmount: string;
    outputTokenAddr: string;
    outputAmount: string;
    orderType: 0 | 1;
    tradeType: 0 | 1;
  }

  interface CancelOrder {
    pairAddress: string;
    orderID: number;
  }
}
