export declare enum CHAIN {
    ETHEREUM = "ETHEREUM",
    KLAYTN = "KLAYTN",
    TERRA = "TERRA",
    ICON = "ICON"
}
export declare enum EthereumServices {
    METAMASK = "metamask"
}
export declare enum KlaytnServices {
    KAIKAS = "kaikas",
    KLIP = "klip",
    DCENT = "dcent"
}
export declare enum IconServices {
    ICONEX = "iconex"
}
export declare type ServiceProfile = {
    name: string;
    label: string;
    provider: string[];
    platform: string[];
    useProvider: boolean;
    getInstallURL(appName: string, siteName: string): string;
};
export declare const getEthereumService: () => ServiceProfile[];
export declare const getKlaytnService: () => ServiceProfile[];
export declare const getIconService: () => ServiceProfile[];
export declare const getService: (chain: string) => ServiceProfile[];
