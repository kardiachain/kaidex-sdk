import { KaidexService } from './kaidex-service';
import JSBI from 'jsbi';
import { methodNames, MINIMUM_TOKEN_AMOUNT } from '../constants';
import { Utils } from '../utils';
import { InputParams, InputType } from '../types/input-params';
import { Fraction } from './fraction';
import { KaidexOptions, SMCParams, Token } from '../types';

export class KaidexClient extends KaidexService {
  constructor({ abis, smcAddresses, rpcEndpoint }: KaidexOptions = {}) {
    super({ abis, smcAddresses, rpcEndpoint });
  }

  getPair = (tokenA: string, tokenB: string): Promise<string> =>
    this.factory.getPair(tokenA, tokenB);

  getApprovalState = async (
    tokenAddr: string,
    walletAddress: string,
    amountToCheck: string | number
  ): Promise<boolean> => {
    const amount = Number(amountToCheck) || MINIMUM_TOKEN_AMOUNT;
    const currentAllowance = await this.krc20.getAllowance(
      tokenAddr,
      walletAddress
    );
    return JSBI.lessThan(
      currentAllowance,
      JSBI.BigInt(Utils.cellValue(amount))
    );
  };

  getTokenBalance = (
    tokenAddress: string,
    walletAddress: string
  ): Promise<string> => {
    return this.krc20.balanceOf(tokenAddress, walletAddress);
  };

  addLiquidityCallParameters = (
    params: InputParams.AddLiquidity
  ): SMCParams.CallParams => {
    const { tokenA: inputToken, tokenB: outputToken } = params;
    // For KAI Pairs
    if (
      this.isKAI(inputToken.tokenAddress) ||
      this.isKAI(outputToken.tokenAddress)
    ) {
      const {
        tokenAddress,
        amountTokenMin,
        amountTokenDesired,
        amountKAI,
        amountKAIMin,
        walletAddress,
        deadlineInMilliseconds,
      } = this.transformAddLiquidityKAIParams(params);

      return {
        methodName: methodNames.ADD_LIQUIDITY_KAI,
        args: [
          tokenAddress,
          amountTokenDesired,
          amountTokenMin,
          amountKAIMin,
          walletAddress,
          deadlineInMilliseconds,
        ],
        amount: amountKAI,
      };
    }

    const {
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      walletAddress,
      deadlineInMilliseconds,
    } = this.transformAddLiquidityParams(params);

    return {
      methodName: methodNames.ADD_LIQUIDITY,
      args: [
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
  };

  removeLiquidityCallParameters = async (
    params: InputParams.RemoveLiquidity
  ): Promise<SMCParams.CallParams> => {
    const { tokenA: inputToken, tokenB: outputToken } = params.pair;
    // For KAI Pairs
    if (
      this.isKAI(inputToken.tokenAddress) ||
      this.isKAI(outputToken.tokenAddress)
    ) {
      const {
        tokenAddress,
        liquidity,
        amountKAIMin,
        amountTokenMin,
        walletAddress,
        deadlineInMilliseconds,
      } = await this.transformRemoveLiquidityKAIParams(params);

      return {
        methodName: methodNames.REMOVE_LIQUIDITY_KAI,
        args: [
          tokenAddress,
          liquidity,
          amountTokenMin,
          amountKAIMin,
          walletAddress,
          deadlineInMilliseconds,
        ],
      };
    }

    const {
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      walletAddress,
      deadlineInMilliseconds,
    } = await this.transformRemoveLiquidityParams(params);

    return {
      methodName: methodNames.REMOVE_LIQUIDITY,
      args: [
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        walletAddress,
        deadlineInMilliseconds,
      ],
    };
  };

  calculateOutputAmount = async ({
    amount,
    inputToken,
    outputToken,
    inputType,
  }: InputParams.CalculateOutputAmount): Promise<string> => {
    if (!amount || !inputToken || !outputToken)
      throw new Error('Params input error.');
    const {
      tokenAddress: inputTokenAddr,
      decimals: inputTokenDec,
    } = inputToken;
    const {
      tokenAddress: outputTokenAddr,
      decimals: outputTokenDec,
    } = outputToken;
    const amountDec = Utils.cellValue(amount, inputTokenDec);
    const path = Utils.renderPair(inputTokenAddr, outputTokenAddr);
    let amountOutDec = '';
    let decimals;

    switch (inputType) {
      case InputType.EXACT_IN:
        amountOutDec = await this.router.getAmountsOut(amountDec, path);
        decimals = outputTokenDec;
        break;
      case InputType.EXACT_OUT:
        amountOutDec = await this.router.getAmountsIn(amountDec, path);
        decimals = inputTokenDec;
        break;
    }
    return Utils.convertValueFollowDecimal(amountOutDec, decimals);
  };

  calculatePriceImpact = async ({
    inputToken,
    outputToken,
    amountIn,
    amountOut,
  }: InputParams.CalculatePriceImpact): Promise<string> => {
    if (!inputToken || !outputToken || !amountIn || !amountOut)
      throw new Error('Params input error.');
    const {
      decimals: inputTokenDec,
      tokenAddress: inputTokenAddr,
    } = inputToken;
    const {
      decimals: outputTokenDec,
      tokenAddress: outputTokenAddr,
    } = outputToken;

    const { reserveA, reserveB } = await this.router.getReserves(
      inputTokenAddr,
      outputTokenAddr
    );
    if (!reserveA || reserveA === '0' || !reserveB || reserveB === '0')
      return '0';

    const amountInDec = Utils.cellValue(amountIn, inputTokenDec);
    const amountOutDec = Utils.cellValue(amountOut, inputTokenDec);

    const midPrice = reserveA
      ? new Fraction(reserveB).divide(reserveA)
      : new Fraction(0);
    const amountInFrac = new Fraction(
      amountInDec,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputTokenDec))
    );
    const amountOutFrac = new Fraction(
      amountOutDec,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputTokenDec))
    );

    const exactQuote = midPrice.multiply(amountInFrac);
    const slippage = exactQuote.subtract(amountOutFrac).divide(exactQuote);
    return slippage.multiply(100).toFixed(5);
  };

  public calculateExchangeRate = async (
    tokenA: Token,
    tokenB: Token
  ): Promise<{ rateAB: number; rateBA: number }> => {
    const { reserveA, reserveB } = await this.router.getReserves(
      tokenA.tokenAddress,
      tokenB.tokenAddress
    );
    const tokenAValue = Utils.convertValueFollowDecimal(
      JSBI.BigInt(reserveA).toString(),
      tokenA.decimals
    );
    const tokenBValue = Utils.convertValueFollowDecimal(
      JSBI.BigInt(reserveB).toString(),
      tokenB.decimals
    );
    const _tokenAValue = Number(tokenAValue);
    const _tokenBValue = Number(tokenBValue);
    const rateAB = _tokenAValue ? _tokenBValue / _tokenAValue : 0;
    const rateBA = _tokenBValue ? _tokenAValue / _tokenBValue : 0;
    return { rateAB, rateBA };
  };

  public marketSwapCallParameters = ({
    amountIn,
    amountOut,
    inputToken,
    outputToken,
    addressTo,
    inputType,
    txDeadline,
    slippageTolerance,
  }: InputParams.MarketSwap): SMCParams.CallParams => {
    if (!amountIn || !amountOut || !addressTo || !inputToken || !outputToken)
      throw new Error('Params input error.');
    const kaiIn = this.isKAI(inputToken.tokenAddress);
    const kaiOut = this.isKAI(outputToken.tokenAddress);
    const amountInDec = Utils.cellValue(amountIn, inputToken.decimals);
    const amountOutDec = Utils.cellValue(amountOut, outputToken.decimals);
    const amountOutMinDec = Utils.calculateSlippageValue(
      amountOutDec,
      slippageTolerance,
      'sub'
    );
    const amountInMaxDec = Utils.calculateSlippageValue(
      amountInDec,
      slippageTolerance,
      'add'
    );
    const path = Utils.renderPair(
      inputToken.tokenAddress,
      outputToken.tokenAddress
    );

    let swapParams: SMCParams.CallParams = {} as SMCParams.CallParams;
    switch (inputType) {
      case InputType.EXACT_IN:
        if (kaiIn) {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_KAI_FOR_TOKENS,
            args: [amountOutMinDec, path, addressTo, txDeadline],
            amount: amountInDec,
          } as SMCParams.CallParams;
        } else if (kaiOut) {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_TOKENS_FOR_KAI,
            args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline],
          };
        } else {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS,
            args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline],
          };
        }
        break;
      case InputType.EXACT_OUT:
        if (kaiIn) {
          swapParams = {
            methodName: methodNames.SWAP_KAI_FOR_EXACT_TOKENS,
            args: [amountOutDec, path, addressTo, txDeadline],
            amount: amountInMaxDec,
          };
        } else if (kaiOut) {
          swapParams = {
            methodName: methodNames.SWAP_TOKENS_FOR_EXACT_KAI,
            args: [amountOutDec, amountInMaxDec, path, addressTo, txDeadline],
          };
        } else {
          swapParams = {
            methodName: methodNames.SWAP_TOKENS_FOR_EXACT_TOKENS,
            args: [amountOutDec, amountOutMinDec, path, addressTo, txDeadline],
          };
        }
        break;
    }
    return swapParams;
  };

  public limitOrderCallParameters = ({
    amountIn,
    amountOut,
    inputToken,
    outputToken,
    inputType,
    tradeType,
  }: InputParams.LimitOrder): SMCParams.CallParams => {
    if (!amountIn || !amountOut || !inputToken || !outputToken)
      throw new Error('Params input error.');
    const {
      tokenAddress: inputTokenAddr,
      decimals: inputTokenDec,
    } = inputToken;
    const {
      tokenAddress: outputTokenAddr,
      decimals: outputTokenDec,
    } = outputToken;
    const amountInDec = Utils.cellValue(amountIn, inputTokenDec);
    const amountOutDec = Utils.cellValue(amountOut, outputTokenDec);
    const kaiIn = this.isKAI(inputToken.tokenAddress);
    let swapParams: SMCParams.CallParams;
    if (kaiIn) {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_KAI,
        args: [outputTokenAddr, amountOutDec, inputType, tradeType],
        amount: amountInDec,
      };
    } else {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_TOKENS,
        args: [
          inputTokenAddr,
          amountInDec,
          outputTokenAddr,
          amountOutDec,
          inputType,
          tradeType,
        ],
      };
    }
    return swapParams;
  };

  public cancelLimitOrder = (
    pairAddress: string,
    orderID: number
  ): SMCParams.CallParams => {
    if (!pairAddress || !orderID) throw new Error('Params input error.');
    return {
      methodName: methodNames.CANCEL_ORDER,
      args: [pairAddress, orderID],
    };
  };
}
