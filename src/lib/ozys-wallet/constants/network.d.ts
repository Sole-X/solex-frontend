import { Network } from '../core/network';
import { CHAIN } from './service';
export declare const getEthereumNetwork: (key: any) => Network[];
export declare const getKlaytnNetwork: () => Network[];
export declare const getIconNetwork: () => Network[];
export declare const getNetwork: (chain: CHAIN, key?: string) => Network[];
export declare const getBlockUrl: (chain: CHAIN, network: Network, block?: number | undefined) => string;
export declare const getTxUrl: (chain: CHAIN, network: Network, txHash?: string | undefined) => string;
export declare const getAccountUrl: (
  chain: CHAIN,
  network: Network,
  address?: string | undefined,
) => string | undefined;
export declare const getTokenUrl: (chain: CHAIN, network: Network, address?: string | undefined) => string;
