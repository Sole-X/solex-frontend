import { WalletProvider } from "../core/wallet/WalletProvider";
import { WalletStore } from "../core/wallet/WalletStore";
declare type Props = {
    store: WalletStore;
    _caver: any;
    networkList: any[];
    requestUrl?: any;
    serviceName?: any;
};
export declare class KlaytnKaikasWallet extends WalletProvider {
    name: string;
    _caver: any;
    store: WalletStore;
    networkList: any[];
    requestUrl: any;
    constructor(props: Props);
    isInstalled(): Promise<boolean>;
    getSelectedProvider(): any;
    isAvailable(): Promise<boolean>;
    isUnlocked(): Promise<boolean>;
    access(): any;
    initSubscribe(): void;
    subscribeNetwork(netId: number): void;
    subscribeAccount(account: string | string[]): void;
    signTx(txParams: any): any;
    broadcastTx(txParams: any): any;
    broadcastFeeDelegateTx(txParams: any, eventBus: any): void;
    signMessage(msg: string): Promise<any>;
    callContract(to: string, params: any, abi: object[]): Promise<any>;
    watchTxReceipt(txHash: any, pollingCount?: number): Promise<unknown>;
}
export {};
