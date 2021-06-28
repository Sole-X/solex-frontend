import { Transaction } from './Transaction';
export declare class IconTransaction extends Transaction implements IconTransaction.Data {
  type: IconTransaction.TxType;
  from: string;
  to: string;
  value: string;
  data: string;
  nid: string;
  stepLimit: string;
  method: string;
  params: any;
  nonce: string;
  version: string;
  constructor(
    type: IconTransaction.TxType,
    from: string,
    to: string,
    value: string,
    data: string,
    nid: string,
    stepLimit: string,
    method: string,
    params: any,
  );
  getIcxTimestamp(): number;
  build(): IconTransaction;
}
export declare namespace IconTransaction {
  enum TxType {
    NORMAL = 'normal',
    MESSAGE = 'message',
    DEPLOY = 'deploy',
    CALL = 'call',
    SEND = 'send',
  }
  interface Data {
    from: string;
    to: string;
    value: string;
    data: string;
  }
}
