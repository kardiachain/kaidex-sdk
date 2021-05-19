import {PooledTokens, Token} from "./token";

export declare namespace SMCParams {
  interface CallParams {
    methodName: string;
    args: (string | string[] | number)[];
    amount?: number | string;
  }

  interface InvokeParams {
    abi: any
    smcAddr: string
    methodName: string,
    params:(string | string[] | number)[]
    amount?: number,
    gasLimit?: number,
    gasPrice?: number
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
}

export interface MyLiquidityPair {
  balance: string;
  name: string;
  pairAddress: string;
  tokenA: Token;
  tokenB: Token;
  provider: string;
  pooledTokens: PooledTokens
}

