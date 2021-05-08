interface KaiDEXOptions {
  rpcEndpoint?: string;
  abis?: ABIS;
  smcAddresses?: SmcAddresses;
}

interface ABIS {
  factory?: any;
  krc20?: any;
  limitOrder?: any;
  pair?: any;
  router?: any;
  // wkai?: any;
}

interface SmcAddresses {
  router?: string;
  factory?: string;
  // kaiSwapper?: string;
  limitOrder?: string;
  wkai?: string;
}
