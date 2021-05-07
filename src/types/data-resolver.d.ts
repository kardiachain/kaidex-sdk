declare namespace DataResolver {
  interface FactoryService {
    getPair: (tokenA: string | Token, tokenB: string | Token) => Promise<string | null>;
  }

  interface KRC20Service {
    getAllowance: (
      contractAddr: string,
      owner: string,
      spenderAddr: string
    ) => Promise<any>;
    approveToken: (tokenAddr: string, spenderAddr: string) => Promise<any>;
    getKrc20Token: (tokenAddress: string, addr: string) => Promise<KRC20Token>;
    balanceOf: (tokenAddress: string, walletAddress: string) => Promise<any>;
    getTotalSupply: (address: string) => Promise<any>;
  }

  interface RouterService {
    getReserves: (tokenA: Token, tokenB: Token) => Promise<PooledTokens>;
    addLiquidity: (params: SMCParams.AddLiquidity) => Promise<any>;
    addLiquidityKAI: (params: SMCParams.AddLiquidityKAI) => Promise<any>;
    removeLiquidity: (params: SMCParams.RemoveLiquidity) => Promise<any>;
    removeLiquidityKAI: (params: SMCParams.RemoveLiquidityKAI) => Promise<any>;
    swapTokens: (params: SMCParams.CallParams) => Promise<any>;
    getAmountsOut: (amountIn: string, path: string[]) => Promise<string>;
  }

  interface LimitOrderService {
    orderInputKAI: (params: SMCParams.OrderInputKAI) => Promise<any>;
    orderInputTokens: (params: SMCParams.OrderInputTokens) => Promise<any>;
    cancelOrder: (params: SMCParams.CancelOrder) => Promise<any>;
  }
}

declare namespace SMCParams {
  interface CallParams {
    methodName: string;
    args: (string | string[])[];
    amount: number | string;
  }

  interface AddLiquidity {
    amountADesired;
    amountBDesired;
    amountAMin;
    amountBMin;
    tokenA;
    tokenB;
    address;
    deadline;
  }

  interface AddLiquidityKAI {
    tokenAddress;
    amountTokenMin;
    amountTokenDesired;
    amountKAI;
    amountKAIMin;
    address;
    deadline;
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
