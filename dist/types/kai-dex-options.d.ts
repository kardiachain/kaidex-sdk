export interface KaidexOptions {
    rpcEndpoint?: string;
    abis?: ABIS;
    smcAddresses?: SmcAddresses;
}
export interface ABIS {
    factory?: any;
    krc20?: any;
    limitOrder?: any;
    router?: any;
}
export interface SmcAddresses {
    router?: string;
    factory?: string;
    limitOrder?: string;
    wkai?: string;
}
