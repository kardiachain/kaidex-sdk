import ROUTER from './abi/router.json';
import FACTORY from './abi/factory.json';
import KRC20 from './abi/krc20.json';
import LIMIT_ORDER from './abi/limit-order.json';

export const abiJson = {
  ROUTER,
  FACTORY,
  KRC20,
  LIMIT_ORDER,
};

export const smcAddresses = {
  ROUTER: '0xD15afC6d61eD34d968176397a89fE5Cbd824D493',
  FACTORY: '0x053Fdaff144a44731f2D9B3847947a9f1c1487Cc',
  LIMIT_ORDER: '0x3E88CE7E64Bb2763CB8e40CF0d6eb9669f391A6b',
  WKAI: '0xbedD01A19B321C01279167709DfF6c7419Eb8AC7',
};
export const endpoint = 'https://dev-1.kardiachain.io';
export * from './methodNames';
