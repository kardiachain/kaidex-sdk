import { methodNames } from '../constants';
import { AbstractSmcService } from '../entities';

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
  ): Promise<any> => {
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
  ): Promise<any> => {
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
    { pairAddr, orderID }: SMCParams.CancelOrder,
    account?: KAIAccount
  ): Promise<any> => {
    const arg = {
      abi: this.abi,
      contractAddr: this.smcAddress,
      methodName: methodNames.CANCEL_ORDER,
      params: [pairAddr, orderID],
    };
    return this.processSmcParams(arg, account);
  };
}
