import { KaidexService } from './kaidex-service';

export class KaidexExtensionClient extends KaidexService {
  approveToken = (tokenAddress: string, spenderAddress: string) =>
    this.krc20.approveToken(tokenAddress, spenderAddress);

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
}
