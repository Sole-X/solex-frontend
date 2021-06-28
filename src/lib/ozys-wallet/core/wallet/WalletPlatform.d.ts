import { ServiceProfile } from '../../constants/service';
export declare class WalletPlatform {
  reconnectProgress: boolean;
  constructor();
  getAvailableService(serviceList: ServiceProfile[]): ServiceProfile[];
  getProviderUrl(store: any, providerUrl: any): any;
}
