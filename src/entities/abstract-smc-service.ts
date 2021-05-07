import KardiaClient, {
  KAIChain,
  KardiaAccount,
  KardiaTransaction,
  KRC20,
} from 'kardia-js-sdk';

import KardiaContract from 'kardia-js-sdk/dist/smc';

export abstract class AbstractSmcService {
  readonly abi: any;
  readonly smcAddress: string;
  readonly kardiaClient: KardiaClient;
  readonly kardiaAccount: KardiaAccount;
  readonly kardiaContract: KardiaContract;
  readonly kardiaTransaction: KardiaTransaction;
  readonly kardiaChain: KAIChain;
  readonly kardiaKrc20: KRC20;

  constructor({
    abi,
    smcAddress,
    client,
  }: {
    abi: any;
    smcAddress: string;
    client: KardiaClient;
  }) {
    this.abi = abi;
    this.smcAddress = smcAddress;
    this.kardiaClient = client;
    this.kardiaAccount = client.account;
    this.kardiaContract = client.contract;
    this.kardiaTransaction = client.transaction;
    this.kardiaChain = client.kaiChain;
    this.kardiaKrc20 = client.krc20;
  }

  async smcCallData({
    abi,
    contractAddr,
    methodName,
    params,
  }: {
    abi: any;
    contractAddr: string;
    methodName: string;
    params: any[];
  }) {
    this.kardiaContract.updateAbi(abi);
    const invoke = await this.kardiaContract.invokeContract(methodName, params);
    return await invoke.call(contractAddr, {}, 'latest');
  }

  async invokeSMC({
    abi,
    smcAddr,
    methodName,
    params,
    amount = 0,
    gasLimit = 10000000, //todo remove hardcode
    gasPrice = 1,
  }: {
    abi: any;
    smcAddr: string;
    methodName: string;
    params: any[];
    amount?: number | string;
    gasLimit?: number;
    gasPrice?: number;
  }): Promise<any> {
    const abiJson =
      typeof abi === 'string'
        ? JSON.parse(abi)
        : JSON.parse(JSON.stringify(abi));
    this.kardiaContract.updateAbi(abiJson);
    const data = await this.kardiaContract
      .invokeContract(methodName, params)
      .txData();
    return this.kardiaTransaction.sendTransactionToExtension(
      {
        gas: gasLimit,
        gasPrice: gasPrice,
        value: amount,
        to: smcAddr,
        data: data,
      },
      true
    );
  }
}
