import { AbstractSmcService } from '../entities';
export declare class FactoryService extends AbstractSmcService {
    getPair: (tokenA: string, tokenB: string) => Promise<string>;
}
