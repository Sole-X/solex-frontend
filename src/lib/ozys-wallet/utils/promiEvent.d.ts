import { Transaction as TxTypes } from '../core/Transaction/TransactionReceipt';
export declare const initPromiseEvent: () => {
  emitter: any;
  update(eventParams: any): void;
  finish(eventParams: any): void;
  error(error: object | Error): void;
  receipt(receipt: TxTypes.Receipt): void;
  txHash(txHash: string): void;
};
