import KardiaClient from 'kardia-js-sdk';
import {
  abiJson,
  endpoint as defaultEndpoint,
  smcAddresses as defaultAddresses,
} from '../constants';
import {
  FactoryService,
  RouterService,
  KRC20Service,
  LimitOrderService,
} from '../services';

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

  getPair = (tokenA: string, tokenB: string) =>
    this.factory.getPair(tokenA, tokenB);

  getReserves = (tokenA: string, tokenB: string) =>
    this.router.getReserves(tokenA, tokenB);
}
