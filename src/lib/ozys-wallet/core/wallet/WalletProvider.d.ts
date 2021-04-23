import { WalletStore } from "./WalletStore";
import { ServiceProfile } from "../../constants/service";
export declare abstract class WalletProvider {
    abstract name: string;
    abstract store: WalletStore;
    abstract access(): Promise<string>;
    abstract isInstalled(): Promise<Boolean>;
    abstract signTx(params: any): Promise<any>;
    abstract broadcastTx(params: any): any | Promise<any>;
}
export declare function getNotInstalledError(profile: ServiceProfile, appName: string, siteName: string): object;
