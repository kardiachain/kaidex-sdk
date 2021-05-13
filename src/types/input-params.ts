export enum TradeType {
  BUY = 0,
  SELL = 1,
}

export enum TradeInputType {
  AMOUNT = 'AMOUNT',
  TOTAL = 'TOTAL',
}

export enum InputType {
  EXACT_IN = 0,
  EXACT_OUT = 1
}

export declare namespace InputParams {
  interface CalculateOutputAmount {
    amount: number | string;
    tokenIn: Token;
    tokenOut: Token;
    inputType: InputType
  }

  interface CalculatePriceImpact {
    tokenIn: Token;
    tokenOut: Token;
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
    txDeadline: string | number;
  }

  interface RemoveLiquidity {
    pair: MyLiquidityPair;
    withdrawPercent: string | number;
    walletAddress: string;
    slippageTolerance: string | number;
    txDeadline: string | number;
  }

  interface MarketSwap {
    amountIn: string;
    amountOut: string;
    tokenIn: Token;
    tokenOut: Token;
    addressTo: string;
    inputType: InputType;
    txDeadline: string | number;
    slippageTolerance: string | number;
  }

  interface LimitOrder {
    amountIn: string;
    amountOut: string;
    tokenIn: Token;
    tokenOut: Token;
    tradeType: TradeType;
    inputType: InputType;
  }
}
