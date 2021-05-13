import KardiaClient from 'kardia-js-sdk';
import {
  abiJson,
  endpoint as defaultEndpoint,
  smcAddresses as defaultAddresses,
  KAI_TOKEN_NAME,
  KAI_TOKEN_SYMBOL,
} from '../constants';
import {
  FactoryService,
  RouterService,
  KRC20Service,
  LimitOrderService,
} from '../services';
import { InputParams } from '../types/input-params';
import { Utils } from '../utils';
import { Fraction } from './fraction';

export abstract class KaidexService {
  protected abiJSON: Required<ABIS>;
  protected smcAddresses: Required<SmcAddresses>;
  protected kardiaClient: KardiaClient;

  public factory: FactoryService;
  public router: RouterService;
  public krc20: KRC20Service;
  public limitOrder: LimitOrderService;

  protected constructor(
    options: KaidexOptions = {
      abis: {},
      smcAddresses: {},
      rpcEndpoint: '',
    }
  ) {
    const { abis, rpcEndpoint, smcAddresses } = options;

    this.abiJSON = {
      router: (abis && abis.router) || abiJson.ROUTER,
      factory: (abis && abis.factory) || abiJson.FACTORY,
      krc20: (abis && abis.krc20) || abiJson.KRC20,
      pair: (abis && abis.pair) || abiJson.PAIR,
      limitOrder: (abis && abis.limitOrder) || abiJson.LIMIT_ORDER,
    };

    this.smcAddresses = {
      router: (smcAddresses && smcAddresses.router) || defaultAddresses.ROUTER,
      factory:
        (smcAddresses && smcAddresses.factory) || defaultAddresses.FACTORY,
      limitOrder:
        (smcAddresses && smcAddresses.limitOrder) ||
        defaultAddresses.LIMIT_ORDER,
      wkai: (smcAddresses && smcAddresses.wkai) || defaultAddresses.WKAI,
    };

    this.kardiaClient = new KardiaClient({
      endpoint: rpcEndpoint || defaultEndpoint,
    });

    this.factory = new FactoryService({
      abi: this.abiJSON.factory,
      smcAddress: this.smcAddresses.factory,
      client: this.kardiaClient,
    });

    this.router = new RouterService({
      abi: this.abiJSON.router,
      smcAddress: this.smcAddresses.router,
      client: this.kardiaClient,
    });

    this.krc20 = new KRC20Service({
      abi: this.abiJSON.krc20,
      client: this.kardiaClient,
      smcAddress: '',
    });

    this.limitOrder = new LimitOrderService({
      abi: this.abiJSON.limitOrder,
      smcAddress: this.smcAddresses.limitOrder,
      client: this.kardiaClient,
    });
  }

  public isKAI = (tokenAddress: string) =>
    !!(
      tokenAddress &&
      this.smcAddresses.wkai &&
      tokenAddress.toLowerCase() === this.smcAddresses.wkai.toLowerCase()
    );

  public prepareTokenFormat = (token: Token): Token => {
    return this.isKAI(token.tokenAddress)
      ? {
          ...token,
          tokenAddress: this.smcAddresses.wkai,
          name: KAI_TOKEN_NAME,
          symbol: KAI_TOKEN_SYMBOL,
          logo: token.logo,
          wKAI: true,
          decimals: 18,
        }
      : token;
  };

  protected transformAddLiquidityParams = (
    params: InputParams.AddLiquidity
  ) => {
    const {
      slippageTolerance,
      txDeadline,
      inputAmount,
      outputAmount,
      tokenA,
      tokenB,
      walletAddress,
    } = params;

    const amountADesiredInDec = inputAmount
      ? Utils.cellValue(inputAmount, tokenA.decimals)
      : '0';
    const amountBDesiredInDec = outputAmount
      ? Utils.cellValue(outputAmount, tokenB.decimals)
      : '0';
    const calculatedAmountAMinInDec = inputAmount
      ? Utils.calculateSlippageValue(
          amountADesiredInDec,
          slippageTolerance,
          'sub'
        )
      : '0';
    const calculatedAmountBMinInDec = outputAmount
      ? Utils.calculateSlippageValue(
          amountBDesiredInDec,
          slippageTolerance,
          'sub'
        )
      : '0';

    return {
      amountADesired: amountADesiredInDec,
      amountBDesired: amountBDesiredInDec,
      amountAMin: calculatedAmountAMinInDec,
      amountBMin: calculatedAmountBMinInDec,
      tokenA: tokenA.tokenAddress,
      tokenB: tokenB.tokenAddress,
      walletAddress,
      deadlineInMilliseconds: txDeadline,
    };
  };

  protected transformAddLiquidityKAIParams = async (
    params: InputParams.AddLiquidity
  ) => {
    const {
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      tokenA,
      tokenB,
      walletAddress,
      deadlineInMilliseconds,
    } = await this.transformAddLiquidityParams(params);

    const otherTokenAddress = this.isKAI(tokenA) ? tokenB : tokenA;
    const otherTokenDesiredAmount = this.isKAI(tokenA)
      ? amountBDesired
      : amountADesired;
    const otherTokenMinAmount = this.isKAI(tokenA) ? amountBMin : amountAMin;
    const amountKAI = this.isKAI(tokenA) ? amountADesired : amountBDesired;
    const amountKAIMin = this.isKAI(tokenA) ? amountAMin : amountBMin;

    return {
      tokenAddress: otherTokenAddress,
      amountTokenMin: otherTokenMinAmount,
      amountTokenDesired: otherTokenDesiredAmount,
      amountKAI,
      amountKAIMin,
      walletAddress,
      deadlineInMilliseconds,
    };
  };

  protected transformRemoveLiquidityParams = async (
    params: InputParams.RemoveLiquidity
  ) => {
    const {
      pair,
      withdrawPercent,
      walletAddress,
      slippageTolerance,
      txDeadline,
    } = params;
    const { tokenA, tokenB, balance, pairAddress } = pair;

    if (!Number(withdrawPercent)) throw new Error('Invalid amount!');
    if (!walletAddress) throw new Error('Invalid wallet!');
    if (!Number(balance)) throw new Error('Not enough balance!');

    const totalSupply = await this.krc20.getTotalSupply(pairAddress);

    //liquidity = balance * withdrawPercent / 100
    const liquidity = new Fraction(balance)
      .multiply(withdrawPercent)
      .divide(100)
      .toFixed();
    const tokenABalance = await this.krc20.balanceOf(
      tokenA.tokenAddress,
      pairAddress
    );

    //amountAMin = (balance / totalSupply) * tokenABalance * withdrawPercent / 100
    const amountAMin = new Fraction(balance)
      .divide(totalSupply)
      .multiply(tokenABalance)
      .multiply(withdrawPercent)
      .divide(100);

    const _amountAMin = Utils.calculateSlippageValue(
      amountAMin,
      slippageTolerance,
      'sub'
    );
    const tokenBBalance = await this.krc20.balanceOf(
      tokenB.tokenAddress,
      pairAddress
    );

    //amountBMin = (balance / totalSupply) * tokenBBalance * withdrawPercent / 100
    const amountBMin = new Fraction(balance)
      .divide(totalSupply)
      .multiply(tokenBBalance)
      .multiply(withdrawPercent)
      .divide(100);

    const _amountBMin = Utils.calculateSlippageValue(
      amountBMin,
      slippageTolerance,
      'sub'
    );

    return {
      tokenA: tokenA.tokenAddress,
      tokenB: tokenB.tokenAddress,
      liquidity: liquidity,
      amountAMin: _amountAMin,
      amountBMin: _amountBMin,
      walletAddress,
      deadlineInMilliseconds: txDeadline,
    };
  };

  protected transformRemoveLiquidityKAIParams = async (
    params: InputParams.RemoveLiquidity
  ) => {
    const {
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      walletAddress,
      deadlineInMilliseconds,
    } = await this.transformRemoveLiquidityParams(params);

    const otherToken = this.isKAI(tokenA) ? tokenB : tokenA;
    const amountKAIMin = this.isKAI(tokenA) ? amountAMin : amountBMin;
    const amountTokenMin = this.isKAI(tokenA) ? amountBMin : amountAMin;

    return {
      tokenAddress: otherToken,
      liquidity: liquidity,
      amountKAIMin: amountKAIMin,
      amountTokenMin: amountTokenMin,
      walletAddress,
      deadlineInMilliseconds,
    };
  };
}
