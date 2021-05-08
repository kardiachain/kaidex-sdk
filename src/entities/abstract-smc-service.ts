import KardiaClient, {
  KAIChain,
  KardiaAccount,
  KardiaTransaction,
  KRC20,
} from 'kardia-js-sdk';

import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from '../constants';

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

  smcCallData = async ({
    abi,
    contractAddr,
    methodName,
    params,
  }: {
    abi: any;
    contractAddr: string;
    methodName: string;
    params: any[];
  }) => {
    this.kardiaContract.updateAbi(abi);
    const invoke = await this.kardiaContract.invokeContract(methodName, params);
    return await invoke.call(contractAddr, {}, 'latest');
  };

  invokeSMC = async ({
    abi,
    contractAddr,
    methodName,
    params,
    amount = '0',
    gasLimit = 3000000,
    gasPrice = 1,
  }: SMCParams.InvokeParams): Promise<any> => {
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
        to: contractAddr,
        data: data,
      },
      true
    );
  };

  smcSendAction = async ({
    abi,
    contractAddr,
    methodName,
    params,
    account,
    amount = '0',
    gasLimit = DEFAULT_GAS_LIMIT,
    gasPrice = DEFAULT_GAS_PRICE,
  }: SMCParams.SendActionParams) => {
    if (!account.publicKey || !account.privateKey) {
      return;
    }

    this.kardiaContract.updateAbi(abi);
    const invoke = await this.kardiaContract.invokeContract(methodName, params);

    return invoke.send(account.privateKey, contractAddr, {
      from: account.publicKey,
      amount: amount,
      gas: gasLimit,
      gasPrice: gasPrice,
    });
  };
}
