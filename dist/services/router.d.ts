import { AbstractSmcService } from '../entities';
import { PooledTokens } from '../types';
export declare class RouterService extends AbstractSmcService {
    getReserves: (tokenA: string, tokenB: string) => Promise<PooledTokens>;
    getAmountsOut: (amountIn: string, path: string[]) => Promise<string>;
    getAmountsIn: (amountOut: string, path: string[]) => Promise<string>;
}
