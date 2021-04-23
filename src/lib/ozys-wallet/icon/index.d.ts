import { CommonWallet } from "../core/wallet";
import { WalletStore } from "../core/wallet/WalletStore";
import { WalletProvider } from "../core/wallet/WalletProvider";
import { WalletPlatform } from "../core/wallet/WalletPlatform";
import { CHAIN, ServiceProfile } from "../constants/service";
declare type WalletProps = {
    network: number;
    service?: string;
    providerType?: number;
    otherOptions?: any;
};
export default class IconWallet extends WalletPlatform implements CommonWallet {
    name: CHAIN;
    _sdk: any;
    store: WalletStore;
    wallet: any | WalletProvider;
    private networkList;
    private profileList;
    constructor(props: WalletProps);
    select(newProps: WalletProps): void;
    access(newProps: WalletProps): any;
    initIconSdk(): void;
    getPublicAPI(): any;
    getContract(params: any): any;
    getAvailableService(): ServiceProfile[];
    getBalance(address: string): Promise<string>;
    getBlockNumber(): Promise<number>;
}
export {};
