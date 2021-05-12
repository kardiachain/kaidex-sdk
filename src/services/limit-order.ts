import { methodNames } from '../constants';
import { AbstractSmcService } from '../entities';
import { KardiaAccount } from 'kardia-js-sdk';

export class LimitOrderService extends AbstractSmcService {
  limitOrderKAI = async (
    {
      outputTokenAddr,
      outputAmount,
      orderType,
      kaiAmountIn,
      tradeType,
    }: SMCParams.LimitOrderKAI,
    account?: KAIAccount
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(outputTokenAddr))
      throw new Error('Invalid token address!');
    if (!outputAmount) throw new Error('Invalid output amount!');
    if (!kaiAmountIn) throw new Error('Invalid KAI amount!');
    if (!orderType) throw new Error('Invalid orderType!');
    if (!tradeType) throw new Error('Invalid tradeType!');

    const arg = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.ORDER_INPUT_KAI,
      params: [outputTokenAddr, outputAmount, orderType, tradeType],
      amount: kaiAmountIn,
    };
    return this.processSmcParams(arg, account);
  };

  limitOrder = async (
    {
      inputAmount,
      inputTokenAddr,
      outputAmount,
      outputTokenAddr,
      orderType,
      tradeType,
    }: SMCParams.LimitOrder,
    account?: KAIAccount
  ): Promise<TxResponse> => {
    if (
      !KardiaAccount.isAddress(inputTokenAddr) ||
      !KardiaAccount.isAddress(outputTokenAddr)
    )
      throw new Error('Invalid token address!');
    if (!inputAmount) throw new Error('Invalid input amount!');
    if (!outputAmount) throw new Error('Invalid output amount!');
    if (!orderType) throw new Error('Invalid orderType!');
    if (!tradeType) throw new Error('Invalid tradeType!');

    const arg = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.ORDER_INPUT_TOKENS,
      params: [
        inputTokenAddr,
        inputAmount,
        outputTokenAddr,
        outputAmount,
        orderType,
        tradeType,
      ],
    };
    return this.processSmcParams(arg, account);
  };

  cancelOrder = async (
    { pairAddress, orderID }: SMCParams.CancelOrder,
    account?: KAIAccount
  ): Promise<TxResponse> => {
    if (!KardiaAccount.isAddress(pairAddress))
      throw new Error('Invalid pair address');
    if (!orderID) throw new Error('Invalid orderId');

    const arg = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.CANCEL_ORDER,
      params: [pairAddress, orderID],
    };
    return this.processSmcParams(arg, account);
  };
}
