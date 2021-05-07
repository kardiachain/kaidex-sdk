import { AbstractKaiDexService } from './entities';
import { FactoryService } from './services';

class KaiDEXClient extends AbstractKaiDexService {
  public factory: FactoryService;

  constructor(props: KaiDEXOptions) {
    super(props);

    this.factory = new FactoryService({
      abi: this.abiJSON.factory,
      smcAddress: this.smcAddresses.factory,
    });
  }
}

export * from './utils';
export default KaiDEXClient;
