import { WalletProvider } from '../core/wallet/WalletProvider';
import { WalletStore } from '../core/wallet/WalletStore';
declare type Props = {
  store: WalletStore;
  _sdk: any;
  networkList: any[];
};
export declare class IconIconexWallet extends WalletProvider {
  name: string;
  _sdk: any;
  store: WalletStore;
  networkList: any[];
  txInterface: any;
  constructor(props: Props);
  isInstalled(): Promise<boolean>;
  getSelectedProvider(): any;
  isAvailable(): Promise<boolean>;
  isUnlocked(): Promise<boolean>;
  requestToIconex(params: any): Promise<unknown>;
  access(): any;
  initSubscribe(): void;
  subscribeNetwork(netId: number): void;
  subscribeAccount(account: string): void;
  estimateStep(from: any, to: any, method: any, value: any, params?: {}): Promise<unknown>;
  serializeTx(params: any, type: any): string;
  signTx(_tx: any): Promise<any>;
  broadcastTx(txParams: any): any;
  signMessage(msg: string): Promise<
    | {
        success: boolean;
        data: any;
      }
    | {
        success: boolean;
        error: Error;
      }
  >;
}
export {};
