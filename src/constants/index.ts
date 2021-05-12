import ROUTER from './abi/router.json';
import FACTORY from './abi/factory.json';
import KRC20 from './abi/krc20.json';
import PAIR from './abi/pair.json';
import LIMIT_ORDER from './abi/limit-order.json';
// import WKAI from './abi/wkai.json';

export const DEFAULT_DEADLINE = 5; // 5 mins
export const DEFAULT_GAS_LIMIT = 10000000;
export const DEFAULT_GAS_PRICE = 2000000000;
export const MINIMUM_TOKEN_AMOUNT = 0.00001;

export const KAI_TOKEN_SYMBOL = 'KAI';
export const KAI_TOKEN_NAME = 'Kardiachain';

export const abiJson = {
  ROUTER,
  FACTORY,
  KRC20,
  PAIR,
  LIMIT_ORDER,
  // WKAI,
};

export const smcAddresses = {
  ROUTER: '0xd258f28642e8AEa592A2D914c1975bcA495FD931',
  FACTORY: '0x334628294f0f7dEA82B414AC0638B8A57F507d28',
  KAI_SWAPPER: '0x20975f4777316F20B8A7ECf61C1b8231208Afa89',
  LIMIT_ORDER: '0x88Fba3d1c8B18257b376786f851A3e03d93c076c',
  WKAI: '0xDFEa10cEbd3c6B01b6832C629Fa932C8a5A54f7E',
};

export const endpoint = 'https://dex-1.kardiachain.io';

export const DEFAULT_APPROVE_AMOUNT = '1000000000000000000000000000000';

export * from './methodNames';
