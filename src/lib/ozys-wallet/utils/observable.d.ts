export declare class Observable {
    private observers;
    constructor();
    subscribe(observer: Function): Function;
    unsubscribe(observer: Function): any[];
    clear(): void;
    notify(newState: any, prevState: any): any;
}
