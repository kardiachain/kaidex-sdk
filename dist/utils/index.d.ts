import JSBI from 'jsbi';
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TEN: JSBI;
export declare const _9975: JSBI;
export declare const _10000: JSBI;
export declare const Utils: {
    cellValue: (kaiValue: any, decimals?: number) => string;
    convertValueFollowDecimal: (value: string, decimals: number) => string;
    calculateSlippageValue: (value: string, slippageTolerance: string | number, type: 'add' | 'sub') => string;
    calculateLiquidityProvidersFee: (amountIn: string | number) => string;
    renderPair: (tokenIn: string, tokenOut: string) => string[];
};
