import { KaidexService } from './kaidex-service';
import JSBI from 'jsbi';
import { methodNames } from '../constants';
import { ONE, Utils, ZERO, _10000, _9975 } from '../utils';
import { Fraction } from './fraction';
import { SMCParams, Token, InputParams, InputType } from '../types';

export class KaidexClient extends KaidexService {
  getPair = (tokenA: string, tokenB: string): Promise<string> =>
    this.factory.getPair(tokenA, tokenB);

  getReserves = (tokenA: string, tokenB: string) =>
    this.router.getReserves(tokenA, tokenB);

  getApprovalState = async ({
    tokenAddr,
    decimals,
    walletAddress,
    spenderAddress,
    amountToCheck,
  }: {
    tokenAddr: string;
    decimals: number;
    walletAddress: string;
    spenderAddress: string;
    amountToCheck: number | string;
  }): Promise<boolean> => {
    if (this.isKAI(tokenAddr)) return true;
    const currentAllowance = await this.krc20.getAllowance(
      tokenAddr,
      walletAddress,
      spenderAddress
    );

    return !JSBI.lessThan(
      currentAllowance,
      JSBI.BigInt(Utils.cellValue(amountToCheck, decimals))
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
        methodName: params.feeOnTransfer ? methodNames.REMOVE_LIQUIDITY_KAI_SUPPORTING_FEE : methodNames.REMOVE_LIQUIDITY_KAI,
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

  calculateOutputAmount = ({
    amount,
    inputToken,
    reserveIn,
    outputToken,
    reserveOut,
    inputType,
  }: InputParams.CalculateOutputAmount): string => {
    if (!amount || !inputToken || !outputToken)
      throw new Error('Params input error.');

    let amountDec;
    let amountOutDec = '';
    let decimals;
    switch (inputType) {
      case InputType.EXACT_IN:
        amountDec = Utils.cellValue(amount, inputToken.decimals);
        // Get amount
        amountOutDec = this.getOutputAmount(amountDec, reserveIn, reserveOut)
        decimals = outputToken.decimals;
        break;
      case InputType.EXACT_OUT:
        amountDec = Utils.cellValue(amount, outputToken.decimals);
        amountOutDec = this.getInputAmount(amountDec, reserveIn, reserveOut)
        decimals = inputToken.decimals;
        break;
    }
    return Utils.convertValueFollowDecimal(amountOutDec, decimals);
  };

  getOutputAmount(inputAmount: string, reserveIn: string, reserveOut: string): string {
    const reserveInBigInt = JSBI.BigInt(reserveIn)
    const reserveOutBigInt = JSBI.BigInt(reserveOut)
    if (JSBI.equal(reserveInBigInt, ZERO) || JSBI.equal(reserveOutBigInt, ZERO)) throw new Error('Insufficient reserves error.');
    const inputAmountWithFee = JSBI.multiply(JSBI.BigInt(inputAmount), _9975)
    const numerator = JSBI.multiply(inputAmountWithFee, reserveOutBigInt)
    const denominator = JSBI.add(JSBI.multiply(reserveInBigInt, _10000), inputAmountWithFee)
    return JSBI.divide(numerator, denominator).toString()
  }

  getInputAmount (outputAmount: string, reserveIn: string, reserveOut: string): string {
    const reserveInBigInt = JSBI.BigInt(reserveIn)
    const reserveOutBigInt = JSBI.BigInt(reserveOut)
    if (JSBI.equal(reserveInBigInt, ZERO) ||
      JSBI.equal(reserveOutBigInt, ZERO) ||
      JSBI.greaterThanOrEqual(JSBI.BigInt(outputAmount), reserveOutBigInt)) throw new Error('Insufficient reserves error.');
    const numerator = JSBI.multiply(JSBI.multiply(reserveInBigInt, JSBI.BigInt(outputAmount)), _10000)
    const denominator = JSBI.multiply(JSBI.subtract(reserveOutBigInt, JSBI.BigInt(outputAmount)), _9975)

    return JSBI.add(JSBI.divide(numerator, denominator), ONE).toString()
  }


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
    const amountOutDec = Utils.cellValue(amountOut, outputTokenDec);

    const reserveAConvertBigInt = inputTokenDec
      ? new Fraction(
        JSBI.BigInt(reserveA),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputTokenDec))
      )
      : new Fraction(JSBI.BigInt(reserveA));
    const reserveBConvertBigInt = outputTokenDec
      ? new Fraction(
        JSBI.BigInt(reserveB),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputTokenDec))
      )
      : new Fraction(JSBI.BigInt(reserveB));
    const midPrice = reserveBConvertBigInt.divide(reserveAConvertBigInt);

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

  calculateExchangeRate = async (
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
    feeOnTransfer
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
            methodName: feeOnTransfer ? methodNames.SWAP_EXACT_KAI_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_KAI_FOR_TOKENS,
            args: [amountOutMinDec, path, addressTo, txDeadline],
            amount: amountInDec,
          } as SMCParams.CallParams;
        } else if (kaiOut) {
          swapParams = {
            methodName: feeOnTransfer ? methodNames.SWAP_EXACT_TOKEN_FOR_KAI_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_TOKENS_FOR_KAI,
            args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline],
          };
        } else {
          swapParams = {
            methodName: feeOnTransfer ? methodNames.SWAP_EXACT_TOKEN_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS,
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
            args: [amountOutDec, amountInMaxDec, path, addressTo, txDeadline],
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
    const kaiOut = this.isKAI(outputToken.tokenAddress);
    let swapParams: SMCParams.CallParams;
    if (kaiIn) {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_KAI,
        args: [outputTokenAddr, amountOutDec, InputType.EXACT_IN, tradeType],
        amount: amountInDec,
      };
    } else if (kaiOut) {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_TOKENS,
        args: [
          inputTokenAddr,
          amountInDec,
          outputTokenAddr,
          amountOutDec,
          InputType.EXACT_OUT,
          tradeType,
        ],
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

  cancelLimitOrder = ({
    pairAddr,
    orderID,
  }: InputParams.CancelOrder): SMCParams.CallParams => {
    if (!pairAddr || orderID === undefined) throw new Error('Params input error.');
    return {
      methodName: methodNames.CANCEL_ORDER,
      args: [pairAddr, orderID],
    } as SMCParams.CallParams;
  };
}
