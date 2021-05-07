import { AbstractKaiDexService } from './entities';
import { FactoryService, RouterService } from './services';

class KaiDEXClient extends AbstractKaiDexService {
  public factory: FactoryService;
  public router: RouterService;

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
  }
}

export * from './utils';
export default KaiDEXClient;
