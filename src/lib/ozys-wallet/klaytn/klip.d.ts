import { WalletProvider } from '../core/wallet/WalletProvider';
import { WalletStore } from '../core/wallet/WalletStore';
import { CommonResponse } from '../core/network';
declare type Props = {
  store: WalletStore;
  _caver: any;
  siteName: string;
};
declare type KlipTxParams = {
  _eventName: string;
  body: any;
};
export declare class KlaytnKlipWallet extends WalletProvider {
  name: string;
  _caver: any;
  store: WalletStore;
  siteName: string;
  maxPollingCount: number;
  constructor(props: Props);
  isInstalled(): Promise<boolean>;
  isUnlocked(): boolean;
  getAvailablePrepareType(): string[];
  prepare(
    type: string,
    body: object,
  ): Promise<
    | {
        success: boolean;
        error: any;
        data?: undefined;
      }
    | {
        success: boolean;
        data: {
          type: string;
          requestKey: any;
          status: any;
          expirationTime: any;
        };
        error?: undefined;
      }
  >;
  requestKlip(requestKey: string): void;
  pollingGetResult(requestKey: string, callback: Function): Promise<CommonResponse>;
  handleAfterPrepare(prepareResult: CommonResponse, eventBus: any): Promise<CommonResponse>;
  access(): any;
  signTx(txParams: any): any;
  broadcastTx(params: KlipTxParams): any;
}
export {};
