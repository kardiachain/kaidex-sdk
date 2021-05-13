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
  ROUTER: '0xFC3B82a6b43F304F12C4d03676A87aBd80BD202c',
  FACTORY: '0x06372db2e7821CEa6A9804abE18346C07E9c4778',
  // KAI_SWAPPER: '0x20975f4777316F20B8A7ECf61C1b8231208Afa89',
  LIMIT_ORDER: '0xc4062FdD0d65aa4ADb96685956B6e4FaBa557227',
  WKAI: '0xAF7E3fd820e3834F14EEfCd9e0cb714ed2437903',
};

export const endpoint = 'https://dex-1.kardiachain.io';

export const DEFAULT_APPROVE_AMOUNT = '1000000000000000000000000000000';

export * from './methodNames';
