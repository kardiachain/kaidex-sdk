import ROUTER from './abi/router.json';
import REWARDS from './abi/reward.json';

export const DEADLINE_DEFAULT = 5; // 5 mins

export const methodNames = {
  GET_AMOUNTS_OUT: 'getAmountsOut',
  SWAP_EXACT_TOKENS_FOR_TOKENS: 'swapExactTokensForTokens',
  CALCULATE_KAI_FEE: 'calculateKAIFee',
};

export const abiJson = {
  ROUTER: ROUTER,
  REWARDS: REWARDS,
};

export const smcAddress = {
  ROUTER: '0x581e5fdB8114023FaEF21666910B3b9b4e612dDc',
  REWARDS: '0x125A43340936520691dF37537EF646d9ab380424',
};
