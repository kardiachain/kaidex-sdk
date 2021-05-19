import JSBI from 'jsbi';
import { AbstractSmcService } from '../entities';
export declare class KRC20Service extends AbstractSmcService {
    getAllowance: (tokenAddress: string, walletAddress: string, spenderAddress: string) => Promise<JSBI>;
    balanceOf: (tokenAddress: string, walletAddress: string) => Promise<any>;
    getTotalSupply(tokenAddress: string): Promise<any>;
}
