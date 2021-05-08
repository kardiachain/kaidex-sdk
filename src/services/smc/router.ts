import { methodNames } from '../../constants';
import JSBI from 'jsbi';
import { AbstractSmcService } from '../../entities';

export class RouterService extends AbstractSmcService {
  getReserves = async (
    tokenA: string,
    tokenB: string
  ): Promise<PooledTokens> => {
    if (!tokenA.trim() || !tokenB.trim()) throw new Error('Invalid token!');

    const result = await this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_RESERVES,
      params: [tokenA, tokenB],
    });

    return { tokenA: result['reserveA'], tokenB: result['reserveB'] };
  };

  addLiquidity = ({
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    tokenA,
    tokenB,
    address,
    deadline,
  }: SMCParams.AddLiquidity) => {
    return this.invokeSMC({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.ADD_LIQUIDITY,
      params: [
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        address,
        deadline,
      ],
    });
  };

  addLiquidityKAI = ({
    tokenAddress,
    amountTokenMin,
    amountTokenDesired,
    amountKAI,
    amountKAIMin,
    address,
    deadline,
  }: SMCParams.AddLiquidityKAI) => {
    return this.invokeSMC({
      abi: this.abi,
      amount: amountKAI,
      contractAddr: this.smcAddress,
      methodName: methodNames.ADD_LIQUIDITY_KAI,
      params: [
        tokenAddress,
        amountTokenDesired,
        amountTokenMin,
        amountKAIMin,
        address,
        deadline,
      ],
    });
  };

  removeLiquidity = ({
    tokenAddressA,
    tokenAddressB,
    liquidity,
    amountAMin,
    amountBMin,
    walletAddress,
    deadline,
  }: SMCParams.RemoveLiquidity) => {
    return this.invokeSMC({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.REMOVE_LIQUIDITY,
      params: [
        tokenAddressA,
        tokenAddressB,
        liquidity,
        amountAMin,
        amountBMin,
        walletAddress,
        deadline,
      ],
    });
  };

  removeLiquidityKAI = ({
    tokenAddress,
    amountTokenMin,
    liquidity,
    amountKAIMin,
    walletAddress,
    deadline,
  }: SMCParams.RemoveLiquidityKAI) => {
    return this.invokeSMC({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.REMOVE_LIQUIDITY_KAI,
      params: [
        tokenAddress,
        liquidity,
        amountTokenMin,
        amountKAIMin,
        walletAddress,
        deadline,
      ],
    });
  };

  swapTokens = ({ methodName, args, amount = '0' }: SMCParams.CallParams) => {
    return this.invokeSMC({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodName,
      params: args,
      amount: amount,
    });
  };

  getAmountsOut = async (amountIn: string, path: string[]): Promise<string> => {
    const result = await this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_AMOUNTS_OUT,
      params: [amountIn, path],
    });
    return result && result.length > 0 ? JSBI.BigInt(result[1]).toString() : '';
  };
}
