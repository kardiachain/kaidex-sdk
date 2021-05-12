interface TxResponse {
  events: any[];
  blockHash: string;
  blockHeight: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  gasUsed: number;
  cumulativeGasUsed: number;
  contractAddress: string;
  logs: any[];
  logsBloom: number[];
  status: 0 | 1;
}
