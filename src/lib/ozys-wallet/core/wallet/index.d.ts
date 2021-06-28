import { WalletStore } from './WalletStore';
export declare type ContractParams = {
  address: string;
  abi?: any;
};
export interface CommonWallet {
  name: string;
  store: WalletStore;
  getPublicAPI(): any;
  getContract(params: ContractParams): any;
  getBalance(address: string): Promise<string>;
  getBlockNumber(): Promise<number>;
}
