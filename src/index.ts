import { AbstractKaiDexService } from './entities';
import {
  FactoryService,
  RouterService,
  KRC20Service,
  LimitOrderService,
} from './services';

class KaiDEXClient extends AbstractKaiDexService {
  public factory: FactoryService;
  public router: RouterService;
  public krc20: KRC20Service;
  public limitOrder: LimitOrderService;

  constructor(props: KaiDEXOptions) {
    super(props);

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
}

export * from './utils';
export default KaiDEXClient;
