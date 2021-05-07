import { DEADLINE_DEFAULT } from "../../constants";
import { kardiaChain } from "../../kardia-tool";

export const calculateTransactionDeadline = async (): Promise<number> => {
    const latestBlock = await kardiaChain.getBlockHeaderByHash('latest')
    return (new Date(latestBlock.time)).getTime() + DEADLINE_DEFAULT * 60;
}

