interface KaiDEXOptions {
  rpcEndpoint?: string;
  abis?: ABIS;
  smcAddresses?: SmcAddresses;
}

interface ABIS {
  factory?: any;
  krc20?: any;
  pair?: any;
  rewards?: any;
  router?: any;
  wkai?: any;
}

interface SmcAddresses {
  router?: string;
  rewards?: string;
  factory?: string;
  kaiSwapper?: string;
  limitOrder?: string;
  wkai?: string;
}
