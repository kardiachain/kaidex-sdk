import { smcCallData } from './';
import { methodNames } from '../../constants';

export class FactoryService {
  readonly abi: any;
  readonly smcAddress: string;

  constructor({ abi, smcAddress }: { abi: any; smcAddress: string }) {
    this.abi = abi;
    this.smcAddress = smcAddress;
  }

  getPair(tokenA: string, tokenB: string) {
    if (!tokenA.trim() || !tokenB.trim()) throw new Error('Invalid token!')

    return smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_PAIR,
      params: [tokenA, tokenB],
    });
  }
}
