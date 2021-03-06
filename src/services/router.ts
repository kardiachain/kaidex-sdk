import { methodNames } from '../constants';
import JSBI from 'jsbi';
import { AbstractSmcService } from '../entities';
import { KardiaAccount } from 'kardia-js-sdk';
import { PooledTokens } from '../types';

const validatePath = (path: string[]): void => {
  if (
    !path ||
    !path.length ||
    !path[0] ||
    !KardiaAccount.isAddress(path[0]) ||
    !path[1] ||
    !KardiaAccount.isAddress(path[1])
  )
    throw new Error('Invalid token address!');
};

export class RouterService extends AbstractSmcService {
  getReserves = async (
    tokenA: string,
    tokenB: string
  ): Promise<PooledTokens> => {
    if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))
      throw new Error('Invalid token!');

    return this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_RESERVES,
      params: [tokenA, tokenB],
    });
  };

  getAmountsOut = async (amountIn: string, path: string[]): Promise<string> => {
    if (!amountIn) throw new Error('Invalid input amount!');
    validatePath(path);
    const result = await this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_AMOUNTS_OUT,
      params: [amountIn, path],
    });
    return result && result.length > 0 ? JSBI.BigInt(result[1]).toString() : '';
  };

  getAmountsIn = async (amountOut: string, path: string[]): Promise<string> => {
    if (!amountOut) throw new Error('Invalid input amount!');
    validatePath(path);
    const result = await this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_AMOUNTS_IN,
      params: [amountOut, path],
    });
    return result && result.length > 0 ? JSBI.BigInt(result[0]).toString() : '';
  };
}
