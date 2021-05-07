interface Account {
  publickey: string;
  privatekey: string;
}

interface SwapParams {
  methodName: string;
  args: (string | string[] | number)[];
  amount: string;
}

interface TokenModal {
  address: string;
  decimals: number;
  symbol: string;
}
