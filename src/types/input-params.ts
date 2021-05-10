declare namespace InputParams {
  interface addLiquidity {
    slippageTolerance: string | number;
    txDeadline: string | number;
    inputAmount: string | number;
    outputAmount: string | number;
    tokenA: Token;
    tokenB: Token;
    walletAddress: string;
  }

  interface removeLiquidity {
    pair: MyLiquidityPair;
    withdrawPercent: string | number;
    walletAddress: string;
    slippageTolerance: string | number;
    txDeadline: string | number;
  }
}
