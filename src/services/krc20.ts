import JSBI from 'jsbi';
import { methodNames, DEFAULT_APPROVE_AMOUNT } from '../constants';
import { AbstractSmcService } from '../entities';

export class KRC20Service extends AbstractSmcService {
  getAllowance = async (tokenAddress: string, owner: string): Promise<JSBI> => {
    const amount = await this.smcCallData({
      abi: this.abi,
      contractAddr: tokenAddress,
      methodName: methodNames.ALLOWANCE,
      params: [owner, this.smcAddress],
    });
    return JSBI.BigInt(amount);
  };

  balanceOf = (tokenAddress: string, walletAddress: string) => {
    return this.smcCallData({
      abi: this.abi,
      methodName: methodNames.BALANCE_OF,
      contractAddr: tokenAddress,
      params: [walletAddress],
    });
  };

  getTotalSupply(tokenAddress: string) {
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

    return this.processSmcParams(args, account);
  };
}
