import ROUTE_SWAP from './abi/route-swap.json';
import REWARDS_ABI from './abi/reward.json';

export const DEADLINE_DEFAULT = 5; // 5 mins

export const methodNames = {
  GET_AMOUNTS_OUT: 'getAmountsOut',
  SWAP_EXACT_TOKENS_FOR_TOKENS: 'swapExactTokensForTokens',
  CALCULATE_KAI_FEE: 'calculateKAIFee',
};

export const abiJson = {
  ROUTE_SWAP: ROUTE_SWAP,
  REWARDS_ABI: REWARDS_ABI,
};

export const smcAddress = {
  ROUTE_SWAP: '0x581e5fdB8114023FaEF21666910B3b9b4e612dDc',
  REWARD: '0x125A43340936520691dF37537EF646d9ab380424',
};
