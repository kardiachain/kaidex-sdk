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
  ROUTER: '0x8375F17C70ef16851Aec5Bb52C2FB83500116B50',
  FACTORY: '0xa192db8C8E07AE5593ED746aF99D174461303F09',
  // KAI_SWAPPER: '0x20975f4777316F20B8A7ECf61C1b8231208Afa89',
  LIMIT_ORDER: '0x702A38dc15e44B1816B76E406A2E8d7DA7126d2A',
  WKAI: '0xb41B61bc5735Dca8EDD98A0945C94372B14275bD',
};

export const endpoint = 'https://dex-1.kardiachain.io';

export const DEFAULT_APPROVE_AMOUNT = '1000000000000000000000000000000';

export * from './methodNames';
