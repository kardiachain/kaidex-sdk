import { DEFAULT_DEADLINE } from '../../constants';
import { kardiaChain } from '../kardia-client';

export const calculateTransactionDeadline = async (): Promise<number> => {
  const latestBlock = await kardiaChain.getBlockHeaderByHash('latest');
  return new Date(latestBlock.time).getTime() + DEFAULT_DEADLINE * 60;
};

export const CommonService = {
  calculateTransactionDeadline,
};
