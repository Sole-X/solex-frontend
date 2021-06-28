export declare type Network = {
  name: string;
  id: number;
  httpEndpoint: string;
  socketEndpoint: string;
  debugEndpoint?: string;
  explorerUrl: string;
};
export declare type CommonResponse = {
  success: boolean;
  data?: any;
  error?:
    | Error
    | {
        message: [string | object];
      };
};
