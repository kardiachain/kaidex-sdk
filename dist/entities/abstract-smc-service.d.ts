import KardiaClient, { KAIChain, KardiaAccount, KardiaTransaction, KRC20 } from 'kardia-js-sdk';
import KardiaContract from 'kardia-js-sdk/dist/smc';
export declare abstract class AbstractSmcService {
    readonly abi: any;
    readonly smcAddress: string;
    readonly kardiaClient: KardiaClient;
    readonly kardiaAccount: KardiaAccount;
    readonly kardiaContract: KardiaContract;
    readonly kardiaTransaction: KardiaTransaction;
    readonly kardiaChain: KAIChain;
    readonly kardiaKrc20: KRC20;
    constructor({ abi, smcAddress, client, }: {
        abi: any;
        smcAddress: string;
        client: KardiaClient;
    });
    smcCallData: ({ abi, contractAddr, methodName, params, }: {
        abi: any;
        contractAddr: string;
        methodName: string;
        params: any[];
    }) => Promise<any>;
}
