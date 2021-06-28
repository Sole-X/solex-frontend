export declare class TransactionReceipt implements Transaction.Receipt {
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  from: string;
  to: string;
  value: string;
  constructor(blockNumber: number, blockHash: string, transactionHash: string, from: string, to: string, value: string);
}
export declare namespace Transaction {
  interface Receipt {
    blockNumber: number;
    blockHash: string;
    transactionHash: string;
    from: string;
    to: string;
    value: string;
    status?: boolean;
  }
}
