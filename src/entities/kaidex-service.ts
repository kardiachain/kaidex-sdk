import KardiaClient from 'kardia-js-sdk';
import {
  abiJson,
  endpoint as defaultEndpoint,
  smcAddresses as defaultAddresses,
} from '../constants';
import { FactoryService, RouterService, KRC20Service } from '../services';
import {
  ABIS,
  KaidexOptions,
  SmcAddresses,
  SMCParams,
  InputParams,
} from '../types';
import { KardiaAccount } from 'kardia-js-sdk';
import { Utils } from '../utils';
import { Fraction } from './fraction';

export abstract class KaidexService {
  protected abiJSON: Required<ABIS>;
  protected smcAddresses: Required<SmcAddresses>;
  protected kardiaClient: KardiaClient;

  public factory: FactoryService;
  public router: RouterService;
  public krc20: KRC20Service;

  constructor(
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
  }

  public get abis() {
    return this.abiJSON;
  }

  public get addresses() {
    return this.smcAddresses;
  }

  public isKAI = (tokenAddress: string) =>
    !!(
      tokenAddress &&
      this.smcAddresses.wkai &&
      tokenAddress.toLowerCase() === this.smcAddresses.wkai.toLowerCase()
    );

  protected transformAddLiquidityParams = (
    params: InputParams.AddLiquidity
  ): SMCParams.AddLiquidity => {
    const {
      slippageTolerance,
      txDeadline,
      inputAmount,
      outputAmount,
      tokenA,
      tokenB,
      walletAddress,
    } = params;

    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (
      !KardiaAccount.isAddress(tokenA.tokenAddress) ||
      !KardiaAccount.isAddress(tokenB.tokenAddress)
    )
      throw new Error('Invalid token address');

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

    if (
      !amountADesiredInDec ||
      !calculatedAmountAMinInDec ||
      !amountBDesiredInDec ||
      !calculatedAmountBMinInDec
    )
      throw new Error('Invalid token amount');
    if (!txDeadline) throw new Error('Invalid deadline');

    return {
      tokenA: tokenA.tokenAddress,
      tokenB: tokenB.tokenAddress,
      amountADesired: amountADesiredInDec,
      amountBDesired: amountBDesiredInDec,
      amountAMin: calculatedAmountAMinInDec,
      amountBMin: calculatedAmountBMinInDec,
      walletAddress,
      deadlineInMilliseconds: txDeadline,
    };
  };

  protected transformAddLiquidityKAIParams = (
    params: InputParams.AddLiquidity
  ): SMCParams.AddLiquidityKAI => {
    const {
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      tokenA,
      tokenB,
      walletAddress,
      deadlineInMilliseconds,
    } = this.transformAddLiquidityParams(params);

    const otherTokenAddress = this.isKAI(tokenA) ? tokenB : tokenA;
    const otherTokenDesiredAmount = this.isKAI(tokenA)
      ? amountBDesired
      : amountADesired;
    const otherTokenMinAmount = this.isKAI(tokenA) ? amountBMin : amountAMin;
    const amountKAI = this.isKAI(tokenA) ? amountADesired : amountBDesired;
    const amountKAIMin = this.isKAI(tokenA) ? amountAMin : amountBMin;

    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');
    if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))
      throw new Error('Invalid token address');
    if (!amountADesired || !amountAMin || !amountBDesired || !amountBMin)
      throw new Error('Invalid token amount');
    if (!deadlineInMilliseconds) throw new Error('Invalid deadline');

    return {
      tokenAddress: otherTokenAddress,
      amountTokenMin: otherTokenMinAmount,
      amountTokenDesired: otherTokenDesiredAmount,
      amountKAI: amountKAI,
      amountKAIMin: amountKAIMin,
      walletAddress,
      deadlineInMilliseconds,
    };
  };

  protected transformRemoveLiquidityParams = async (
    params: InputParams.RemoveLiquidity
  ): Promise<SMCParams.RemoveLiquidity> => {
    const {
      pair,
      withdrawPercent,
      walletAddress,
      slippageTolerance,
      txDeadline,
    } = params;
    const { tokenA, tokenB, pairAddress } = pair;

    const balance = await this.krc20.balanceOf(pairAddress, walletAddress)

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
      .divide(100)
      .toFixed();

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
      .divide(100)
      .toFixed();

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
  ): Promise<SMCParams.RemoveLiquidityKAI> => {
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

  public invokeSMC = async ({
    abi,
    smcAddr,
    methodName,
    params,
    amount = 0,
    gasLimit = 5000000,
    gasPrice = 1,
  }: SMCParams.InvokeParams) => {
    const abiJson =
      typeof abi === 'string'
        ? JSON.parse(abi)
        : JSON.parse(JSON.stringify(abi));
    this.kardiaClient.contract.updateAbi(abiJson);
    const data = await this.kardiaClient.contract
      .invokeContract(methodName, params)
      .txData();
    return this.kardiaClient.transaction.sendTransactionToExtension(
      {
        gas: gasLimit,
        gasPrice: gasPrice,
        value: amount,
        to: smcAddr,
        data: data,
      },
      true
    );
  };
}
