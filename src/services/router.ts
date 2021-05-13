import { methodNames } from '../constants';
import JSBI from 'jsbi';
import { AbstractSmcService } from '../entities';
import { KardiaAccount } from 'kardia-js-sdk';

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

const validateSwapParams = (params: SMCParams.SwapParams): void => {
  const { exactAmount, path, addressTo, deadlineInMilliseconds } = params;

  validatePath(path);
  if (!KardiaAccount.isAddress(addressTo))
    throw new Error('Invalid wallet address!');
  if (!exactAmount) throw new Error('Invalid exact amount!');
  if (!deadlineInMilliseconds) throw new Error('Invalid deadline');
};

export class RouterService extends AbstractSmcService {
  getReserves = async (
    tokenA: string,
    tokenB: string
  ): Promise<PooledTokens> => {
    if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))
      throw new Error('Invalid token!');

    const result = await this.smcCallData({
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.GET_RESERVES,
      params: [tokenA, tokenB],
    });

    return { reserveA: result['reserveA'], reserveB: result['reserveB'] };
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
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))
      throw new Error('Invalid token address');
    if (!amountADesired || !amountAMin || !amountBDesired || !amountBMin)
      throw new Error('Invalid token amount');
    if (!deadlineInMilliseconds) throw new Error('Invalid deadline');

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
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token address');
    if (!amountKAI || !amountKAIMin || !amountTokenDesired || !amountTokenMin)
      throw new Error('Invalid token amount');
    if (!deadlineInMilliseconds) throw new Error('Invalid deadline');

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
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))
      throw new Error('Invalid token address');
    if (!liquidity) throw new Error('Invalid liquidity amount');
    if (!amountAMin || !amountBMin) throw new Error('Invalid token amount');
    if (!deadlineInMilliseconds) throw new Error('Invalid deadline');

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
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token address');
    if (!liquidity) throw new Error('Invalid liquidity amount');
    if (!amountKAIMin || !amountTokenMin)
      throw new Error('Invalid token amount');
    if (!deadlineInMilliseconds) throw new Error('Invalid deadline');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!minimumOutputAmountInDecimal) throw new Error('Invalid output Amount');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!maximumInputAmountInDecimal) throw new Error('Invalid input Amount');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!minimumOutputAmountInDecimal) throw new Error('Invalid input Amount');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!minimumOutputAmountInDecimal) throw new Error('Invalid out Amount');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!maximumInputAmountInDecimal) throw new Error('Invalid input Amount');

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
  ): Promise<TxResponse> => {
    validateSwapParams({
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    });
    if (!maximumInputAmountInDecimal) throw new Error('Invalid input Amount');

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
