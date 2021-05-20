import { KaidexService } from './kaidex-service';
import { SMCParams, Token, InputParams } from '../types';
export declare class KaidexClient extends KaidexService {
    getPair: (tokenA: string, tokenB: string) => Promise<string>;
    getReverses: (tokenA: string, tokenB: string) => Promise<import("../types").PooledTokens>;
    getApprovalState: ({ tokenAddr, decimals, walletAddress, spenderAddress, amountToCheck }: {
        tokenAddr: string;
        decimals: number;
        walletAddress: string;
        spenderAddress: string;
        amountToCheck: number | string;
    }) => Promise<boolean>;
    getTokenBalance: (tokenAddress: string, walletAddress: string) => Promise<string>;
    addLiquidityCallParameters: (params: InputParams.AddLiquidity) => SMCParams.CallParams;
    removeLiquidityCallParameters: (params: InputParams.RemoveLiquidity) => Promise<SMCParams.CallParams>;
    calculateOutputAmount: ({ amount, inputToken, outputToken, inputType, }: InputParams.CalculateOutputAmount) => Promise<string>;
    calculatePriceImpact: ({ inputToken, outputToken, amountIn, amountOut, }: InputParams.CalculatePriceImpact) => Promise<string>;
    calculateExchangeRate: (tokenA: Token, tokenB: Token) => Promise<{
        rateAB: number;
        rateBA: number;
    }>;
    marketSwapCallParameters: ({ amountIn, amountOut, inputToken, outputToken, addressTo, inputType, txDeadline, slippageTolerance, }: InputParams.MarketSwap) => SMCParams.CallParams;
    limitOrderCallParameters: ({ amountIn, amountOut, inputToken, outputToken, inputType, tradeType, }: InputParams.LimitOrder) => SMCParams.CallParams;
    cancelLimitOrder: ({ pairAddr, orderID }: InputParams.CancelOrder) => SMCParams.CallParams;
}
