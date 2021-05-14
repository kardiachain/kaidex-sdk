import ROUTER from './abi/router.json';
import FACTORY from './abi/factory.json';
import KRC20 from './abi/krc20.json';
import LIMIT_ORDER from './abi/limit-order.json';

export const MINIMUM_TOKEN_AMOUNT = 0.00001;

export const abiJson = {
  ROUTER,
  FACTORY,
  KRC20,
  LIMIT_ORDER,
};

export const smcAddresses = {
  ROUTER: '0xFC3B82a6b43F304F12C4d03676A87aBd80BD202c',
  FACTORY: '0x06372db2e7821CEa6A9804abE18346C07E9c4778',
  LIMIT_ORDER: '0xc4062FdD0d65aa4ADb96685956B6e4FaBa557227',
  WKAI: '0xAF7E3fd820e3834F14EEfCd9e0cb714ed2437903',
};

export const endpoint = 'https://dex-1.kardiachain.io';

export * from './methodNames';
