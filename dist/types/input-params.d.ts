import { LiquidityPair, Token } from './index';
export declare enum TradeType {
    BUY = 0,
    SELL = 1
}
export declare enum InputType {
    EXACT_IN = 0,
    EXACT_OUT = 1
}
export declare namespace InputParams {
    interface CalculateOutputAmount {
        amount: number | string;
        inputToken: Token;
        outputToken: Token;
        inputType: InputType;
        reserveIn: string;
        reserveOut: string;
    }
    interface CalculatePriceImpact {
        inputToken: Token;
        outputToken: Token;
        amountIn: string;
        amountOut: string;
    }
    interface AddLiquidity {
        inputAmount: string | number;
        outputAmount: string | number;
        tokenA: Token;
        tokenB: Token;
        walletAddress: string;
        slippageTolerance: string | number;
        txDeadline: number;
    }
    interface RemoveLiquidity {
        pair: LiquidityPair;
        withdrawAmount: string;
        walletAddress: string;
        slippageTolerance: string | number;
        txDeadline: number;
        feeOnTransfer?: boolean;
    }
    interface MarketSwap {
        amountIn: string;
        amountOut: string;
        inputToken: Token;
        outputToken: Token;
        addressTo: string;
        inputType: InputType;
        txDeadline: number;
        slippageTolerance: string | number;
        feeOnTransfer: boolean;
    }
    interface LimitOrder {
        amountIn: string;
        amountOut: string;
        inputToken: Token;
        outputToken: Token;
        tradeType: TradeType;
        inputType: InputType;
        orderKAIFee?: number;
    }
    interface CancelOrder {
        orderID: number;
    }
}
