import { methodNames } from '../constants';
import { AbstractSmcService } from '../entities';

export class FactoryService extends AbstractSmcService {
  getPair = (tokenA: string, tokenB: string) => {
    if (!tokenA.trim() || !tokenB.trim()) throw new Error('Invalid token!');

    return this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_PAIR,
      params: [tokenA, tokenB],
    });
  };
}
