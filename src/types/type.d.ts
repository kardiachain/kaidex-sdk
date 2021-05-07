interface Account {
  publickey: string;
  privatekey: string;
}

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
  tokenA: string;
  tokenB: string;
}
