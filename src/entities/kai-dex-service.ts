import KardiaClient from 'kardia-js-sdk';
import {
  abiJson,
  endpoint as defaultEndpoint,
  smcAddresses as defaultAddresses,
} from '../constants';


export abstract class AbstractKaiDexService {
  protected abiJSON: Required<ABIS>;
  protected smcAddresses: Required<SmcAddresses>;
  protected _kardiaClient: KardiaClient;

  constructor(options: KaiDEXOptions = {
    abis: {},
    smcAddresses: {},
    rpcEndpoint: ''
  }) {
    const { abis, rpcEndpoint, smcAddresses } = options;

    this.abiJSON = {
      router: (abis && abis.router) || abiJson.ROUTER,
      factory: (abis && abis.factory) || abiJson.FACTORY,
      krc20: (abis && abis.krc20) || abiJson.KRC20,
      pair: (abis && abis.pair) || abiJson.PAIR,
      rewards: (abis && abis.rewards) || abiJson.REWARDS,
      wkai: (abis && abis.wkai) || abiJson.WKAI,
    };

    this.smcAddresses = {
      router: (smcAddresses && smcAddresses.router) || defaultAddresses.ROUTER,
      factory:
        (smcAddresses && smcAddresses.factory) || defaultAddresses.FACTORY,
      limitOrder:
        (smcAddresses && smcAddresses.limitOrder) || defaultAddresses.LIMIT_ORDER,
      kaiSwapper:
        (smcAddresses && smcAddresses.kaiSwapper) || defaultAddresses.KAI_SWAPPER,
      rewards:
        (smcAddresses && smcAddresses.rewards) || defaultAddresses.REWARDS,
      wkai: (smcAddresses && smcAddresses.wkai) || defaultAddresses.WKAI,
    };

    this._kardiaClient = new KardiaClient({
      endpoint: rpcEndpoint || defaultEndpoint,
    });
  }
}

