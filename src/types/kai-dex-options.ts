export interface KaidexOptions {
  rpcEndpoint?: string;
  abis?: ABIS;
  smcAddresses?: SmcAddresses;
}

export interface ABIS {
  factory?: any;
  krc20?: any;
  limitOrder?: any;
  pair?: any;
  router?: any;
  // wkai?: any;
}

export interface SmcAddresses {
  router?: string;
  factory?: string;
  // kaiSwapper?: string;
  limitOrder?: string;
  wkai?: string;
}
