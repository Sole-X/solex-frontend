export declare class Transaction implements Transaction.Data {
  method: string;
  params: [string | number | [string] | [number]];
  value: string;
  from: string;
  to: string;
  constructor(method: string, params: [string | number | [string] | [number]], value: string, from: string, to: string);
  build(): any;
  encodeFunction(): string;
}
export declare namespace Transaction {
  interface Data {
    from: string;
    to: string;
    value: string;
    method: string;
    params: [string | number | [string] | [number]];
    hash?: string;
    data?: string;
    abi?: object;
    build(): Transaction;
    encodeFunction(): string;
  }
}
