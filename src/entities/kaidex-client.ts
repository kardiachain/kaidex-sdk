import { KaidexService } from './kaidex-service';
import { KardiaAccount } from 'kardia-js-sdk';

export class KaidexClient extends KaidexService {
  private account: KAIAccount;

  constructor(props: NonExtensionKaidexOptions) {
    super(props);
    const { account } = props;

    this.account = account;
    const { privateKey, publicKey } = account;
    if (!KardiaAccount.isAddress(publicKey) || !privateKey.trim())
      throw new Error('Invalid Account!');
  }

  updateAccount = (account: KAIAccount) => (this.account = account);

  approveToken = (tokenAddress: string, spenderAddress: string) =>
    this.krc20.approveToken(tokenAddress, spenderAddress, this.account);

  addLiquidity = (args: SMCParams.AddLiquidity) =>
    this.router.addLiquidity(args, this.account);
  removeLiquidity = (args: SMCParams.RemoveLiquidity) =>
    this.router.removeLiquidity(args, this.account);
  addLiquidityKAI = (args: SMCParams.AddLiquidityKAI) =>
    this.router.addLiquidityKAI(args, this.account);
  removeLiquidityKAI = (args: SMCParams.RemoveLiquidityKAI) =>
    this.router.removeLiquidityKAI(args, this.account);

  swapExactTokensForTokens = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactTokensForTokens(args, this.account);
  swapTokensForExactTokens = (args: SMCParams.InputSwapParams) =>
    this.router.swapTokensForExactTokens(args, this.account);
  swapExactKAIForTokens = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactKAIForTokens(args, this.account);
  swapExactTokensForKAI = (args: SMCParams.OutputSwapParams) =>
    this.router.swapExactTokensForKAI(args, this.account);
  swapTokensForExactKAI = (args: SMCParams.InputSwapParams) =>
    this.router.swapTokensForExactKAI(args, this.account);
  swapKAIForExactTokens = (args: SMCParams.InputSwapParams) =>
    this.router.swapKAIForExactTokens(args, this.account);

  orderInputKAI = (args: SMCParams.OrderInputKAI) =>
    this.limitOrder.orderInputKAI(args, this.account);
  orderInputTokens = (args: SMCParams.OrderInputTokens) =>
    this.limitOrder.orderInputTokens(args, this.account);
  cancelOrder = (args: SMCParams.CancelOrder) =>
    this.limitOrder.cancelOrder(args, this.account);
}
