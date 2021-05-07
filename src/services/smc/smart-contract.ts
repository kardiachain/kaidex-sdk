import { kardiaContract } from '../kardia-client';

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
