import { KaidexService } from './kaidex-service';
import { KardiaAccount } from 'kardia-js-sdk';
import JSBI from 'jsbi';
import { methodNames, MINIMUM_TOKEN_AMOUNT } from '../constants';
import { Utils } from '../utils';
import { InputParams } from '../types/input-params';
import { TradeType, TradeInputType } from '../types/input-params';
import { Fraction } from './fraction';

export class KaidexClient extends KaidexService {
  private account: KAIAccount;

  constructor(props: KaidexOptions) {
    super(props);

    const account = props.account
      ? props.account
      : { privateKey: '', publicKey: '' };
    this.account = account;
    const { privateKey, publicKey } = account;

    if (!KardiaAccount.isAddress(publicKey) || !privateKey.trim())
      throw new Error('Invalid Account!');
  }

  updateAccount = (account: KAIAccount) => (this.account = account);

  getPair = (tokenA: string, tokenB: string) =>
    this.factory.getPair(tokenA, tokenB);

  approveToken = (tokenAddress: string): Promise<any> =>
    this.krc20.approveToken(tokenAddress, this.account);

  getApprovalState = async (
    tokenAddr: string,
    walletAddress: string,
    amountToCheck: string | number
  ): Promise<any> => {
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

  getTokenBalance = (tokenAddress: string, walletAddress: string) => {
    const _walletAddress = walletAddress
      ? walletAddress
      : this.account.publicKey;
    return this.krc20.balanceOf(tokenAddress, _walletAddress);
  };

  addLiquidity = async (params: InputParams.AddLiquidity) => {
    const { tokenA, tokenB } = params;

    if (this.isKAI(tokenA.tokenAddress) || this.isKAI(tokenB.tokenAddress)) {
      const addLiquidityParams = await this.transformAddLiquidityKAIParams(
        params
      );
      return this.router.addLiquidityKAI(addLiquidityParams);
    }

    const addLiquidityKAIParams = await this.transformAddLiquidityParams(
      params
    );
    return this.router.addLiquidity(addLiquidityKAIParams);
  };

  removeLiquidity = async (params: InputParams.RemoveLiquidity) => {
    const { tokenA, tokenB } = params.pair;
    // For KAI Pairs
    if (this.isKAI(tokenA.tokenAddress) || this.isKAI(tokenB.tokenAddress)) {
      const removeLiquidityKAIParams = await this.transformRemoveLiquidityKAIParams(
        params
      );
      return this.router.removeLiquidityKAI(
        removeLiquidityKAIParams,
        this.account
      );
    }
    const removeLiquidityParams = await this.transformRemoveLiquidityParams(
      params
    );
    return this.router.removeLiquidity(removeLiquidityParams, this.account);
  };

  calculateOutputAmount = async ({
    amountIn,
    tradeInputType,
    tokenA,
    tokenB,
  }: InputParams.CalculateOutputAmount): Promise<string> => {
    if (
      !amountIn ||
      !tokenA.tokenAddress ||
      !tokenB.tokenAddress ||
      tokenA.decimals === undefined ||
      tokenB.decimals === undefined
    )
      throw new Error('Params input error.');

    const amountInDec =
      tradeInputType === TradeInputType.AMOUNT
        ? Utils.cellValue(amountIn, tokenA.decimals)
        : Utils.cellValue(amountIn, tokenB.decimals);
    const path =
      tradeInputType === TradeInputType.AMOUNT
        ? [tokenA.tokenAddress, tokenB.tokenAddress]
        : [tokenB.tokenAddress, tokenA.tokenAddress];

    return this.router.getAmountsOut(amountInDec, path);
  };

  calculatePriceImpact = async ({
    tokenA,
    tokenB,
    inputAmount,
    estimateOutput,
    tradeInputType,
  }: InputParams.CalculatePriceImpact) => {
    const inputToken =
      tradeInputType === TradeInputType.AMOUNT ? tokenA : tokenB;
    const outputToken =
      tradeInputType === TradeInputType.AMOUNT ? tokenB : tokenA;

    const { reserveA, reserveB } = await this.router.getReserves(
      inputToken.tokenAddress,
      outputToken.tokenAddress
    );

    if (!reserveA || reserveA === '0' || !reserveB || reserveB === '0')
      return '0';

    const inputAmountInDecimal = Utils.cellValue(
      inputAmount,
      inputToken.decimals
    );
    const midPrice = tokenA
      ? new Fraction(reserveB).divide(reserveA)
      : new Fraction(0);
    const inputAmountFrac = new Fraction(
      inputAmountInDecimal,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputToken.decimals))
    );
    const estimateOutputFrac = new Fraction(
      estimateOutput,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputToken.decimals))
    );
    const exactQuote = midPrice.multiply(inputAmountFrac);
    const slippage = exactQuote.subtract(estimateOutputFrac).divide(exactQuote);

    return slippage.multiply(100).toFixed(5);
  };

  marketSwap = async ({
    txDeadline,
    slippageTolerance,
    inputAmount,
    outputAmount,
    addressTo,
    pair,
    tradeInputType,
    tradeType,
  }: InputParams.MarketSwap) => {
    if (!inputAmount || !outputAmount || !addressTo || !pair)
      throw new Error('Params input error.');
    const isReserve = tradeType === TradeType.BUY;

    const deadlineInMilliseconds: number = await this.calculateTransactionDeadline(
      txDeadline
    );

    const { tokenA, tokenB } = pair;

    const methodName = this.findSwapType(
      tokenA.tokenAddress,
      tokenB.tokenAddress,
      tradeType,
      tradeInputType
    );
    let inputToken = !isReserve ? pair.tokenA : pair.tokenB;
    let outputToken = !isReserve ? pair.tokenB : pair.tokenA;

    let exactAmount = Utils.cellValue(inputAmount, inputToken.decimals);
    let minimumOutputAmountInDecimal = await Utils.calculateSlippageValue(
      outputAmount,
      slippageTolerance,
      'sub'
    );
    let maximumInputAmountInDecimal = await Utils.calculateSlippageValue(
      outputAmount,
      slippageTolerance,
      'add'
    );
    const path = [inputToken.tokenAddress, outputToken.tokenAddress];

    const args = {
      exactAmount,
      path,
      addressTo,
      deadlineInMilliseconds,
    };

    switch (methodName) {
      case methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS:
        return this.router.swapExactTokensForTokens(
          { ...args, minimumOutputAmountInDecimal },
          this.account
        );

      case methodNames.SWAP_TOKENS_FOR_EXACT_TOKENS:
        return this.router.swapTokensForExactTokens(
          { ...args, maximumInputAmountInDecimal },
          this.account
        );

      case methodNames.SWAP_EXACT_KAI_FOR_TOKENS:
        return this.router.swapExactKAIForTokens(
          { ...args, minimumOutputAmountInDecimal },
          this.account
        );

      case methodNames.SWAP_EXACT_TOKENS_FOR_KAI:
        return this.router.swapExactTokensForKAI(
          { ...args, minimumOutputAmountInDecimal },
          this.account
        );

      case methodNames.SWAP_TOKENS_FOR_EXACT_KAI:
        return this.router.swapTokensForExactKAI(
          { ...args, maximumInputAmountInDecimal },
          this.account
        );

      case methodNames.SWAP_KAI_FOR_EXACT_TOKENS:
        return this.router.swapKAIForExactTokens(
          { ...args, maximumInputAmountInDecimal },
          this.account
        );
    }
  };

  // swapExactTokensForTokens = (args: SMCParams.OutputSwapParams) =>
  //   this.router.swapExactTokensForTokens(args, this.account);
  // swapTokensForExactTokens = (args: SMCParams.InputSwapParams) =>
  //   this.router.swapTokensForExactTokens(args, this.account);
  // swapExactKAIForTokens = (args: SMCParams.OutputSwapParams) =>
  //   this.router.swapExactKAIForTokens(args, this.account);
  // swapExactTokensForKAI = (args: SMCParams.OutputSwapParams) =>
  //   this.router.swapExactTokensForKAI(args, this.account);
  // swapTokensForExactKAI = (args: SMCParams.InputSwapParams) =>
  //   this.router.swapTokensForExactKAI(args, this.account);
  // swapKAIForExactTokens = (args: SMCParams.InputSwapParams) =>
  //   this.router.swapKAIForExactTokens(args, this.account);

  orderInputKAI = (args: SMCParams.OrderInputKAI) =>
    this.limitOrder.orderInputKAI(args, this.account);
  orderInputTokens = (args: SMCParams.OrderInputTokens) =>
    this.limitOrder.orderInputTokens(args, this.account);
  cancelOrder = (args: SMCParams.CancelOrder) =>
    this.limitOrder.cancelOrder(args, this.account);
}
