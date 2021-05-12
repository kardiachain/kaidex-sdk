interface Token {
  tokenAddress: string;
  logo?: string;
  name: string;
  symbol: string;
  decimals: number;
  liquidity?: number;
  volume24hr?: number;
  price?: number;
  change24hr?: number;
  yourBalance: string;
  wKAI?: boolean;
  disabled?: boolean;
}

interface PooledTokens {
  reserveA: string;
  reserveB: string;
}
