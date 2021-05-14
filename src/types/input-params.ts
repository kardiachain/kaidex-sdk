import { MyLiquidityPair, Token } from './index';

export enum TradeType {
  BUY = 0,
  SELL = 1,
}

export enum InputType {
  EXACT_IN = 0,
  EXACT_OUT = 1,
}

export declare namespace InputParams {
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
    pair: MyLiquidityPair;
    withdrawPercent: string | number;
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

  interface LimitOrder {
    amountIn: string;
    amountOut: string;
    inputToken: Token;
    outputToken: Token;
    tradeType: TradeType;
    inputType: InputType;
  }

  interface CancelOrder {
    pairAddr: string;
    orderID: number;
  }
}
