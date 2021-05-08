import JSBI from 'jsbi';
import { methodNames, DEFAULT_APPROVE_AMOUNT } from '../../constants';
import { AbstractSmcService } from '../../entities';
import { KardiaAccount } from 'kardia-js-sdk';

export class KRC20Service extends AbstractSmcService {
  getAllowance = async (
    contractAddr: string,
    owner: string,
    spenderAddr: string
  ): Promise<JSBI> => {
    const amount = await this.smcCallData({
      abi: this.abi,
      contractAddr: contractAddr,
      methodName: methodNames.ALLOWANCE,
      params: [owner, spenderAddr],
    });
    return JSBI.BigInt(amount);
  };

  approveToken = async (
    tokenAddr: string,
    spenderAddr: string
  ): Promise<any> => {
    return this.invokeSMC({
      abi: this.abi,
      contractAddr: tokenAddr,
      methodName: methodNames.APPROVE,
      params: [spenderAddr, DEFAULT_APPROVE_AMOUNT],
    });
  };

  getKrc20Token = async (
    tokenAddress: string,
    addr: string
  ): Promise<KRC20Token> => {
    // Validate address
    if (
      !KardiaAccount.isAddress(tokenAddress) ||
      !KardiaAccount.isAddress(addr)
    ) {
      throw new Error('Invalid address!');
    }
    this.kardiaKrc20.address = tokenAddress;

    // Get KRC20 token info
    const promiseArr = await Promise.all([
      // Get balance
      this.kardiaKrc20.getName(true),
      // Get decimals
      this.kardiaKrc20.getDecimals(true),
      // Get symbol
      this.kardiaKrc20.getSymbol(true),
      // Get balance of
      this.kardiaKrc20.balanceOf(addr),
    ]);

    return {
      address: addr,
      name: promiseArr[0] || '',
      decimals: promiseArr[1],
      symbol: promiseArr[2] || '',
      balance: promiseArr[3] || '',
    } as KRC20Token;
  };

  balanceOf = (tokenAddress: string, walletAddress: string) => {
    return this.smcCallData({
      abi: this.abi,
      methodName: methodNames.BALANCE_OF,
      contractAddr: tokenAddress,
      params: [walletAddress],
    });
  };

  getTotalSupply(address: string) {
    return this.smcCallData({
      abi: this.abi,
      contractAddr: address,
      methodName: methodNames.TOTAL_SUPPLY,
      params: [],
    });
  }
}
