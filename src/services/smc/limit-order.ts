import { methodNames } from '../../constants';
import { AbstractSmcService } from '../../entities';

export class LimitOrderService extends AbstractSmcService {
  orderInputKAI = async ({
    outputTokenAddr,
    outputAmount,
    orderType,
    kaiAmountIn,
    tradeType,
  }: SMCParams.OrderInputKAI): Promise<any> => {
    return this.invokeSMC({
      abi: this.abi,
      smcAddr: this.smcAddress,
      methodName: methodNames.ORDER_INPUT_KAI,
      params: [outputTokenAddr, outputAmount, orderType, tradeType],
      amount: kaiAmountIn,
    });
  };

  orderInputTokens = async ({
    inputAmount,
    inputTokenAddr,
    outputAmount,
    outputTokenAddr,
    orderType,
    tradeType,
  }: SMCParams.OrderInputTokens): Promise<any> => {
    return this.invokeSMC({
      abi: this.abi,
      smcAddr: this.smcAddress,
      methodName: methodNames.ORDER_INPUT_TOKENS,
      params: [
        inputTokenAddr,
        inputAmount,
        outputTokenAddr,
        outputAmount,
        orderType,
        tradeType,
      ],
    });
  };

  cancelOrder = async ({
    pairAddr,
    orderID,
  }: SMCParams.CancelOrder): Promise<any> => {
    return this.invokeSMC({
      abi: this.abi,
      smcAddr: this.smcAddress,
      methodName: methodNames.CANCEL_ORDER,
      params: [pairAddr, orderID],
    });
  };
}
