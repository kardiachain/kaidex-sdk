import JSBI from 'jsbi';
import { Fraction } from '../entities/fraction';
export declare const ONE: JSBI;
export declare const TEN: JSBI;
export declare const Utils: {
    cellValue: (kaiValue: any, decimals?: number) => string;
    convertValueFollowDecimal: (value: Fraction | string, decimals: number) => string;
    calculateSlippageValue: (value: string, slippageTolerance: string | number, type: 'add' | 'sub') => string;
    calculateLiquidityProvidersFee: (amountIn: string | number) => string;
    renderPair: (tokenIn: string, tokenOut: string) => string[];
};
