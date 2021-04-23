import { CommonWallet } from "../core/wallet";
import { WalletStore } from "../core/wallet/WalletStore";
import { WalletPlatform } from "../core/wallet/WalletPlatform";
import { WalletProvider } from "../core/wallet/WalletProvider";
import { CHAIN, ServiceProfile } from "../constants/service";
declare type WalletProps = {
    network: number;
    apiKey: string;
    service?: string;
    providerType?: number;
    providerUrl?: any;
    otherOptions?: any;
};
export default class EthereumWallet extends WalletPlatform implements CommonWallet {
    name: CHAIN;
    store: WalletStore;
    _web3: any;
    wallet: any | WalletProvider;
    private readonly providerUrl;
    private readonly networkList;
    private readonly profileList;
    constructor(props: WalletProps);
    select(newProps: WalletProps): void;
    access(newProps: WalletProps): any;
    initWeb3(): void;
    getPublicAPI(): any;
    getContract(params: any): any;
    getAvailableService(): ServiceProfile[];
    watchingWeb3Status(): Promise<void>;
    restartWalletAPI(): Promise<unknown>;
    getBalance(address: string): Promise<string>;
    getBlockNumber(): Promise<number>;
}
export {};
