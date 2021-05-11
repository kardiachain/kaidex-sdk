import { methodNames } from '../constants';
import JSBI from 'jsbi';
import { AbstractSmcService } from '../entities';

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

  addLiquidity = (
    {
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      tokenA,
      tokenB,
      walletAddress,
      deadlineInMilliseconds,
    }: SMCParams.AddLiquidity,
    account?: KAIAccount
  ) => {
    const args = {
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
        walletAddress,
        deadlineInMilliseconds,
      ],
    };

    return this.processSmcParams(args, account);
  };

  addLiquidityKAI = (
    {
      tokenAddress,
      amountTokenMin,
      amountTokenDesired,
      amountKAI,
      amountKAIMin,
      walletAddress,
      deadlineInMilliseconds,
    }: SMCParams.AddLiquidityKAI,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      amount: amountKAI,
      contractAddr: this.smcAddress,
      methodName: methodNames.ADD_LIQUIDITY_KAI,
      params: [
        tokenAddress,
        amountTokenDesired,
        amountTokenMin,
        amountKAIMin,
        walletAddress,
        deadlineInMilliseconds,
      ],
    };

    return this.processSmcParams(args, account);
  };

  removeLiquidity = (
    {
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      walletAddress,
      deadlineInMilliseconds,
    }: SMCParams.RemoveLiquidity,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.REMOVE_LIQUIDITY,
      params: [
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        walletAddress,
        deadlineInMilliseconds,
      ],
    };
    return this.processSmcParams(args, account);
  };

  removeLiquidityKAI = (
    {
      tokenAddress,
      amountTokenMin,
      liquidity,
      amountKAIMin,
      walletAddress,
      deadlineInMilliseconds,
    }: SMCParams.RemoveLiquidityKAI,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.REMOVE_LIQUIDITY_KAI,
      params: [
        tokenAddress,
        liquidity,
        amountTokenMin,
        amountKAIMin,
        walletAddress,
        deadlineInMilliseconds,
      ],
    };
    return this.processSmcParams(args, account);
  };

  swapExactTokensForTokens = (
    {
      exactAmount,
      minimumOutputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.OutputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS,
      params: [
        exactAmount,
        minimumOutputAmountInDecimal,
        path,
        addressTo,
        deadlineInMilliseconds,
      ],
      amount: '0',
    };

    return this.processSmcParams(args, account);
  };

  swapTokensForExactTokens = (
    {
      exactAmount,
      maximumInputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.InputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_TOKENS_FOR_EXACT_TOKENS,
      params: [
        exactAmount,
        maximumInputAmountInDecimal,
        path,
        addressTo,
        deadlineInMilliseconds,
      ],
      amount: '0',
    };

    return this.processSmcParams(args, account);
  };

  swapExactKAIForTokens = (
    {
      exactAmount,
      minimumOutputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.OutputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_EXACT_KAI_FOR_TOKENS,
      params: [
        minimumOutputAmountInDecimal,
        path,
        addressTo,
        deadlineInMilliseconds,
      ],
      amount: exactAmount,
    };

    return this.processSmcParams(args, account);
  };

  swapExactTokensForKAI = (
    {
      exactAmount,
      minimumOutputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.OutputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_EXACT_TOKENS_FOR_KAI,
      params: [
        exactAmount,
        minimumOutputAmountInDecimal,
        path,
        addressTo,
        deadlineInMilliseconds,
      ],
      amount: '0',
    };

    return this.processSmcParams(args, account);
  };

  swapTokensForExactKAI = (
    {
      exactAmount,
      maximumInputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.InputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_TOKENS_FOR_EXACT_KAI,
      params: [
        exactAmount,
        maximumInputAmountInDecimal,
        path,
        addressTo,
        deadlineInMilliseconds,
      ],
      amount: '0',
    };

    return this.processSmcParams(args, account);
  };

  swapKAIForExactTokens = (
    {
      exactAmount,
      maximumInputAmountInDecimal,
      path,
      addressTo,
      deadlineInMilliseconds,
    }: SMCParams.InputSwapParams,
    account?: KAIAccount
  ) => {
    const args = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.SWAP_KAI_FOR_EXACT_TOKENS,
      params: [exactAmount, path, addressTo, deadlineInMilliseconds],
      amount: maximumInputAmountInDecimal,
    };

    return this.processSmcParams(args, account);
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
