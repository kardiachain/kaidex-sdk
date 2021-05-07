import ROUTER from './abi/router.json';
import FACTORY from './abi/factory.json';
import KRC20 from './abi/krc20.json';
import PAIR from './abi/pair.json';
import REWARDS from './abi/rewards.json';
import WKAI from './abi/wkai.json';

export const DEADLINE_DEFAULT = 5; // 5 mins

export const abiJson = {
  ROUTER,
  FACTORY,
  KRC20,
  PAIR,
  REWARDS,
  WKAI,
};

export const smcAddresses = {
  ROUTER: '0xd258f28642e8AEa592A2D914c1975bcA495FD931',
  REWARDS: '0x125A43340936520691dF37537EF646d9ab380424',
  FACTORY: '0x334628294f0f7dEA82B414AC0638B8A57F507d28',
  KAI_SWAPPER: '0x20975f4777316F20B8A7ECf61C1b8231208Afa89',
  LIMIT_ORDER: '0x88Fba3d1c8B18257b376786f851A3e03d93c076c',
  WKAI: '0xDFEa10cEbd3c6B01b6832C629Fa932C8a5A54f7E',
};

export const endpoint = 'https://dex-1.kardiachain.io';

export * from './methodNames';
