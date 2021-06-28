import { CommonWallet, ContractParams } from './core/wallet';
import { CommonResponse } from './core/network';
import { CHAIN } from './constants/service';
declare global {
  interface Window {
    caver: any;
    klaytn: any;
    ethereum: any;
    metamask: any;
  }
}
export declare type Props = {
  chain: CHAIN;
  network: number;
  service?: string;
  providerType?: number | undefined;
  providerUrl?: any;
  otherOptions?: any;
  requestUrl?: any;
};
export default class OzysWallet {
  platform: CommonWallet | any;
  version: string;
  lastProps: Props | object;
  constructor(props: Props);
  initProps(props: any, needInitStore?: boolean): any;
  initPlatform(props: Props): void;
  select(newProps: any): any;
  access(newProps: any): any;
  disconnect(): void;
  getStore(): any;
  getPublicAPI(): any;
  getAvailableService(): any;
  subscribe(func: Function): void;
  unsubcribe(func: Function): void;
  getBalance(address: string): Promise<string>;
  getBlockNumber(): Promise<number>;
  getContract(params: ContractParams): any;
  broadcastTx(tx: any): CommonResponse | Promise<CommonResponse>;
  getBlockUrl(block: any): string;
  getTxUrl(txHash: any): string;
  getAccountUrl(address: any): string | undefined;
  getTokenUrl(address: any): string;
}
