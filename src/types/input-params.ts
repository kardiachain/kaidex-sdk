enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

enum TradeInputType {
  AMOUNT = 'AMOUNT',
  TOTAL = 'TOTAL',
}

declare namespace InputParams {
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
    inputAmount: string | number;
    outputAmount: string | number;
    addressTo: string;
    pair: Pair;
    tradeInputType: TradeInputType;
    tradeType: TradeType;
    slippageTolerance: string | number;
    txDeadline: string | number;
  }
}
