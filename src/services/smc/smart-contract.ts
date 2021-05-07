import { kardiaContract, kardiaTransaction } from '../kardia-client';

export const smcCallData = async ({
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
  kardiaContract.updateAbi(abi);
  const invoke = await kardiaContract.invokeContract(methodName, params);
  return await invoke.call(contractAddr, {}, 'latest');
};

export const invokeSMC = async ({
  abi,
  smcAddr,
  methodName,
  params,
  amount = 0,
  gasLimit = 10000000,
  gasPrice = 1,
}: {
  abi: any;
  smcAddr: string;
  methodName: string;
  params: any[];
  amount?: number | string;
  gasLimit?: number;
  gasPrice?: number;
}): Promise<any> => {
  const abiJson =
    typeof abi === 'string' ? JSON.parse(abi) : JSON.parse(JSON.stringify(abi));
  kardiaContract.updateAbi(abiJson);
  const data = await kardiaContract.invokeContract(methodName, params).txData();
  return await kardiaTransaction.sendTransactionToExtension(
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
