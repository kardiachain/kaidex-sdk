interface Pair {
  favorite?: boolean;
  name: string;
  price?: number;
  volume?: number;
  change?: number;
  pairAddress: string;
  tokenA: Token;
  tokenB: Token;
  rate?: number | string;
  inverseRate?: number | string;
  pooledTokens: PooledTokens;
  liquidity?: string;
}

interface MyLiquidityPair {
  balance: string;
  name: string;
  pairAddress: string;
  tokenA: Token;
  tokenB: Token;
  provider: string;
  amountA: string;
  amountB: string;
}
