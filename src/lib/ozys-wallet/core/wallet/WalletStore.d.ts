import EventEmitter from 'eventemitter3';
import { Network } from '../network';
import { Observable } from '../../utils/observable';
import { ServiceProfile } from '../../constants/service';
export declare type Props = {
  account: string;
  network: object | Network;
  profile: object | ServiceProfile;
  providerType: number | undefined;
};
export declare class WalletStore extends Observable {
  state: any;
  watcher: EventEmitter;
  constructor(props: Props);
  clear(): void;
  setState(nextState?: object, callback?: Function): void;
}
