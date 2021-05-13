import { KaidexService } from './kaidex-service';
import JSBI from 'jsbi';
import { methodNames, MINIMUM_TOKEN_AMOUNT } from '../constants';
import { Utils } from '../utils';
import { InputParams, InputType } from '../types/input-params';
import { Fraction } from './fraction';

export class KaidexClient extends KaidexService {

  constructor({abis, smcAddresses, rpcEndpoint }: KaidexOptions) {
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
    const currentAllowance = await this.krc20.getAllowance(tokenAddr, walletAddress);
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

  // addLiquidity = async (
  //   params: InputParams.AddLiquidity
  // ): Promise<TxResponse> => {
  //   const { tokenA, tokenB } = params;

  //   if (this.isKAI(tokenA.tokenAddress) || this.isKAI(tokenB.tokenAddress)) {
  //     const addLiquidityParams = await this.transformAddLiquidityKAIParams(
  //       params
  //     );
  //     return this.router.addLiquidityKAI(addLiquidityParams);
  //   }

  //   const addLiquidityKAIParams = await this.transformAddLiquidityParams(
  //     params
  //   );
  //   return this.router.addLiquidity(addLiquidityKAIParams);
  // };

  // removeLiquidity = async (
  //   params: InputParams.RemoveLiquidity
  // ): Promise<TxResponse> => {
  //   const { tokenA, tokenB } = params.pair;
  //   // For KAI Pairs
  //   if (this.isKAI(tokenA.tokenAddress) || this.isKAI(tokenB.tokenAddress)) {
  //     const removeLiquidityKAIParams = await this.transformRemoveLiquidityKAIParams(
  //       params
  //     );
  //     return this.router.removeLiquidityKAI(
  //       removeLiquidityKAIParams,
  //       this.account
  //     );
  //   }
  //   const removeLiquidityParams = await this.transformRemoveLiquidityParams(
  //     params
  //   );
  //   return this.router.removeLiquidity(removeLiquidityParams, this.account);
  // };

  calculateOutputAmount = async ({
    amount,
    tokenIn,
    tokenOut,
    inputType,
  }: InputParams.CalculateOutputAmount): Promise<string> => {
    if (!amount || !tokenIn || !tokenOut) throw new Error('Params input error.')
    const { tokenAddress: tokenInAddr, decimals: tokenInDec } = tokenIn
    const { tokenAddress: tokenOutAddr, decimals: tokenOutDec } = tokenOut
    const amountDec = Utils.cellValue(amount, tokenInDec)
    const path = Utils.renderPair(tokenInAddr, tokenOutAddr)
    let amountOutDec = '';
    let decimals;

    switch (inputType) {
      case InputType.EXACT_IN:
          amountOutDec = await this.router.getAmountsOut(amountDec, path)
          decimals = tokenOutDec
          break;
      case InputType.EXACT_OUT:
          amountOutDec = await this.router.getAmountsIn(amountDec, path)
          decimals = tokenInDec
          break;
    }
    return Utils.convertValueFollowDecimal(amountOutDec, decimals)
  };

  calculatePriceImpact = async ({
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
  }: InputParams.CalculatePriceImpact): Promise<string> => {
    if (!tokenIn || !tokenOut || !amountIn || !amountOut) throw new Error("Params input error.")
    const { decimals: tokenInDec, tokenAddress: tokenInAddr } = tokenIn
    const { decimals: tokenOutDec,  tokenAddress: tokenOutAddr } = tokenOut

    const { reserveA, reserveB } = await this.router.getReserves(tokenInAddr, tokenOutAddr);
    if (!reserveA || reserveA === '0' || !reserveB || reserveB === '0') return '0';

    const amountInDec = Utils.cellValue(amountIn, tokenInDec)
    const amountOutDec = Utils.cellValue(amountOut, tokenInDec)

    const midPrice = reserveA ? new Fraction(reserveB).divide(reserveA) : new Fraction(0);
    const amountInFrac = new Fraction(amountInDec, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokenInDec)))
    const amountOutFrac = new Fraction(amountOutDec, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokenOutDec)))

    const exactQuote = midPrice.multiply(amountInFrac)
    const slippage = exactQuote.subtract(amountOutFrac).divide(exactQuote)
    return slippage.multiply(100).toFixed(5)
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

  marketSwapCallParameters = ({
    amountIn,
    amountOut,
    tokenIn,
    tokenOut,
    addressTo,
    inputType,
    txDeadline,
    slippageTolerance
  }: InputParams.MarketSwap): SMCParams.CallParams => {
    if (!amountIn || !amountOut || !addressTo || !tokenIn || !tokenOut) throw new Error("Params input error.")
    const kaiIn = this.isKAI(tokenIn.tokenAddress)
    const kaiOut = this.isKAI(tokenOut.tokenAddress)
    const amountInDec = Utils.cellValue(amountIn, tokenIn.decimals)
    const amountOutDec = Utils.cellValue(amountOut, tokenOut.decimals)
    const amountOutMinDec = Utils.calculateSlippageValue(amountOutDec, slippageTolerance, 'sub')
    const amountInMaxDec = Utils.calculateSlippageValue(amountInDec, slippageTolerance, 'add')
    const path = Utils.renderPair(tokenIn.tokenAddress, tokenOut.tokenAddress)

    let swapParams: SMCParams.CallParams = {} as SMCParams.CallParams
    switch (inputType) {
      case InputType.EXACT_IN:
        if (kaiIn) {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_KAI_FOR_TOKENS,
            args: [amountOutMinDec, path, addressTo, txDeadline],
            amount: amountInDec
          } as SMCParams.CallParams
        } else if (kaiOut) {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_TOKENS_FOR_KAI,
            args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline]
          }
        } else {
          swapParams = {
            methodName: methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS,
            args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline]
          }
        }
        break;
      case InputType.EXACT_OUT:
        if (kaiIn) {
          swapParams = {
            methodName: methodNames.SWAP_KAI_FOR_EXACT_TOKENS,
            args: [amountOutDec, path, addressTo, txDeadline],
            amount: amountInMaxDec
          }
        } else if (kaiOut) {
          swapParams = {
            methodName: methodNames.SWAP_TOKENS_FOR_EXACT_KAI,
            args: [amountOutDec, amountInMaxDec, path, addressTo, txDeadline]
          }
        } else {
          swapParams = {
            methodName: methodNames.SWAP_TOKENS_FOR_EXACT_TOKENS,
            args: [amountOutDec, amountOutMinDec, path, addressTo, txDeadline]
          }
        }
        break;
    }
    return swapParams
  };

  limitOrderCallParameters = ({
    amountIn,
    amountOut,
    tokenIn,
    tokenOut,
    inputType,
    tradeType
  }: InputParams.LimitOrder): SMCParams.CallParams => {

    if (!amountIn || !amountOut || !tokenIn || !tokenOut) throw new Error("Params input error.")
    const { tokenAddress: tokenInAddr, decimals: tokenInDec } = tokenIn;
    const { tokenAddress: tokenOutAddr,  decimals: tokenOutDec } = tokenOut;
    const amountInDec = Utils.cellValue(amountIn, tokenInDec)
    const amountOutDec = Utils.cellValue(amountOut, tokenOutDec)
    const kaiIn = this.isKAI(tokenIn.tokenAddress)
    let swapParams: SMCParams.CallParams = {} as SMCParams.CallParams
    if (kaiIn) {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_KAI,
        args: [tokenOutAddr, amountOutDec, inputType, tradeType],
        amount: amountInDec,
      }
    } else {
      swapParams = {
        methodName: methodNames.ORDER_INPUT_TOKENS,
        args: [tokenInAddr, amountInDec, tokenOutAddr, amountOutDec, inputType, tradeType]
      }
    }
    return swapParams
  };

  cancelLimitOrder = (
    pairAddress: string,
    orderID: number
  ): SMCParams.CallParams => {
    if (!pairAddress || !orderID) throw new Error('Params input error.')
    return {
      methodName: methodNames.CANCEL_ORDER,
      args: [pairAddress, orderID]
    } as SMCParams.CallParams
  };
}
