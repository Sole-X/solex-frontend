import { CommonWallet } from "../core/wallet";
import { WalletStore } from "../core/wallet/WalletStore";
import { WalletPlatform } from "../core/wallet/WalletPlatform";
import { WalletProvider } from "../core/wallet/WalletProvider";
import { CHAIN, ServiceProfile } from "../constants/service";
declare type WalletProps = {
    network: number;
    service?: string;
    providerType?: number;
    providerUrl?: any;
    otherOptions?: any;
    requestUrl?: any;
};
export default class KlaytnWallet extends WalletPlatform implements CommonWallet {
    name: CHAIN;
    store: WalletStore;
    _caver: any;
    wallet: any | WalletProvider;
    private readonly providerUrl;
    private readonly networkList;
    private readonly profileList;
    private readonly requestUrl;
    constructor(props: WalletProps);
    select(newProps: WalletProps): void;
    access(newProps: WalletProps): any;
    initCaver(): void;
    getPublicAPI(): any;
    getContract(params: any): any;
    getAvailableService(): ServiceProfile[];
    watchingCaverStatus(): Promise<void>;
    restartWalletAPI(): Promise<unknown>;
    getBalance(address: string): Promise<string>;
    getBlockNumber(): Promise<number>;
}
export {};
