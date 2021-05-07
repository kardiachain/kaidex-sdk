import { smcCallData } from './smart-contract';
import { abiJson, methodNames, smcAddress } from '../../constants';
import JSBI from 'jsbi';

const getAmountsOut = async (amountIn: string, path: string[]) => {
  const result = await smcCallData({
    abi: abiJson.ROUTER,
    contractAddr: smcAddress.ROUTER,
    methodName: methodNames.GET_AMOUNTS_OUT,
    params: [amountIn, path],
  });
  return result && result.length > 0 ? JSBI.BigInt(result[1]).toString() : '';
};

const calculateKAIFee = async (
  amountIn: string,
  tokenAddr: string
): Promise<string> => {
  const result = await smcCallData({
    abi: abiJson.REWARDS,
    contractAddr: smcAddress.REWARDS,
    methodName: methodNames.CALCULATE_KAI_FEE,
    params: [amountIn, tokenAddr],
  });
  return JSBI.BigInt(result).toString();
};

export const RouterService = {
  getAmountsOut,
  calculateKAIFee,
};
