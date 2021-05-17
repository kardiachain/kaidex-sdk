export interface Token {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface PooledTokens {
  reserveA: string;
  reserveB: string;
}
