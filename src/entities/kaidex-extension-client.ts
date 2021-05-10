import { KaidexService } from './kaidex-service';
import JSBI from 'jsbi';

export class KaidexExtensionClient extends KaidexService {
  approveToken = (tokenAddress: string) =>
    this.krc20.approveToken(tokenAddress, this.smcAddresses.router);
  getApproveState = async (
    tokenAddr: string,
    walletAddress: string
  ): Promise<any> => {
    const res = await this.krc20.getAllowance(
      tokenAddr,
      walletAddress,
      this.smcAddresses.router
    );
    return JSBI.BigInt(res).toString();
  };

  addLiquidity = (args: SMCParams.AddLiquidity) =>
    this.router.addLiquidity(args);
  removeLiquidity = (args: SMCParams.RemoveLiquidity) =>
    this.router.removeLiquidity(args);
  addLiquidityKAI = (args: SMCParams.AddLiquidityKAI) =>
    this.router.addLiquidityKAI(args);
  removeLiquidityKAI = (args: SMCParams.RemoveLiquidityKAI) =>
    this.router.removeLiquidityKAI(args);

  swapExactTokensForTokens = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactTokensForTokens(args);
  swapTokensForExactTokens = (args: SMCParams.InputSwapParams) =>
    this.router.swapTokensForExactTokens(args);
  swapExactKAIForTokens = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactKAIForTokens(args);
  swapExactTokensForKAI = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactTokensForKAI(args);
  swapTokensForExactKAI = (args: SMCParams.InputSwapParams) =>
    this.router.swapTokensForExactKAI(args);
  swapKAIForExactTokens = (args: SMCParams.InputSwapParams) =>
    this.router.swapKAIForExactTokens(args);

  orderInputKAI = (args: SMCParams.OrderInputKAI) =>
    this.limitOrder.orderInputKAI(args);
  orderInputTokens = (args: SMCParams.OrderInputTokens) =>
    this.limitOrder.orderInputTokens(args);
  cancelOrder = (args: SMCParams.CancelOrder) =>
    this.limitOrder.cancelOrder(args);
}
