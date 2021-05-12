import JSBI from 'jsbi';
import { methodNames, DEFAULT_APPROVE_AMOUNT } from '../constants';
import { AbstractSmcService } from '../entities';
import { KardiaAccount } from 'kardia-js-sdk';

export class KRC20Service extends AbstractSmcService {
  getAllowance = async (
    tokenAddress: string,
    walletAddress: string
  ): Promise<JSBI> => {
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token Address');
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');

    const amount = await this.smcCallData({
      abi: this.abi,
      contractAddr: tokenAddress,
      methodName: methodNames.ALLOWANCE,
      params: [walletAddress, this.smcAddress],
    });
    return JSBI.BigInt(amount);
  };

  balanceOf = (tokenAddress: string, walletAddress: string) => {
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token Address');
    if (!KardiaAccount.isAddress(walletAddress))
      throw new Error('Invalid wallet address');

    return this.smcCallData({
      abi: this.abi,
      methodName: methodNames.BALANCE_OF,
      contractAddr: tokenAddress,
      params: [walletAddress],
    });
  };

  getTotalSupply(tokenAddress: string) {
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token Address');

    return this.smcCallData({
      abi: this.abi,
      contractAddr: tokenAddress,
      methodName: methodNames.TOTAL_SUPPLY,
      params: [],
    });
  }

  approveToken = async (
    tokenAddress: string,
    account?: KAIAccount
  ): Promise<TxResponse> => {
    const args = {
      abi: this.abi,
      contractAddr: tokenAddress,
      methodName: methodNames.APPROVE,
      params: [this.smcAddress, DEFAULT_APPROVE_AMOUNT],
    };
    if (!KardiaAccount.isAddress(tokenAddress))
      throw new Error('Invalid token Address');

    return this.processSmcParams(args, account);
  };
}
