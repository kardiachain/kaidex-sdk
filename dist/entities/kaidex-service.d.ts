import KardiaClient from 'kardia-js-sdk';
import { FactoryService, RouterService, KRC20Service } from '../services';
import { ABIS, KaidexOptions, SmcAddresses, SMCParams, InputParams } from '../types';
export declare abstract class KaidexService {
    protected abiJSON: Required<ABIS>;
    protected smcAddresses: Required<SmcAddresses>;
    protected kardiaClient: KardiaClient;
    factory: FactoryService;
    router: RouterService;
    krc20: KRC20Service;
    constructor(options?: KaidexOptions);
    get abis(): Required<ABIS>;
    get addresses(): Required<SmcAddresses>;
    isKAI: (tokenAddress: string) => boolean;
    protected transformAddLiquidityParams: (params: InputParams.AddLiquidity) => SMCParams.AddLiquidity;
    protected transformAddLiquidityKAIParams: (params: InputParams.AddLiquidity) => SMCParams.AddLiquidityKAI;
    protected transformRemoveLiquidityParams: (params: InputParams.RemoveLiquidity) => Promise<SMCParams.RemoveLiquidity>;
    protected transformRemoveLiquidityKAIParams: (params: InputParams.RemoveLiquidity) => Promise<SMCParams.RemoveLiquidityKAI>;
    invokeSMC: ({ abi, smcAddr, methodName, params, amount, gasLimit, gasPrice, }: SMCParams.InvokeParams) => Promise<any>;
}
