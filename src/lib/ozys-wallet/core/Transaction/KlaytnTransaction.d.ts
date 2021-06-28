import { Transaction } from './Transaction';
export declare class KlaytnTransaction extends Transaction implements KlaytnTransaction.Data {
  type: KlaytnTransaction.TxType;
  method: string;
  params: [string | number | [string] | [number]];
  value: string;
  from: string;
  to: string;
  data?: string | undefined;
  abi?: object | undefined;
  constructor(
    type: KlaytnTransaction.TxType,
    method: string,
    params: [string | number | [string] | [number]],
    value: string,
    from: string,
    to: string,
    data?: string | undefined,
    abi?: object | undefined,
  );
  build(): KlaytnTransaction.Data;
  encodeFunction(): string;
}
export declare namespace KlaytnTransaction {
  enum TxType {
    legacy = 'LEGACY',
    valueTransfer = 'VALUE_TRANSFER',
    valueTransferMemo = 'VALUE_TRANSFER_MEMO',
    feeDelegatedValueTransfer = 'FEE_DELEGATED_VALUE_TRANSFER',
    feeDelegatedValueTransferWithRatio = 'FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO',
    accountUpdate = 'ACCOUNT_UPDATE',
    feeDelegatedAccountUpdate = 'FEE_DELEGATED_ACCOUNT_UPDATE',
    feeDelegatedAccountUpdateWithRatio = 'FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO',
    smartContractDeploy = 'SMART_CONTRACT_DEPLOY',
    feeDelegatedSmartContractDeploy = 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY',
    feeDelegatedSmartContractDeployWithRatio = 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY_WITH_RATIO',
    smartContractExecution = 'SMART_CONTRACT_EXECUTION',
    feeDelegatedSmartContractExecution = 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    feeDelegatedSmartContractExecutionWithRatio = 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION_WITH_RATIO',
    cancel = 'CANCEL',
    feeDelegatedCancel = 'FEE_DELEGATED_CANCEL',
    feeDelegatedCancelWithRatio = 'FEE_DELEGATED_CANCEL_WITH_RATIO',
  }
  interface Data {
    type: TxType;
    from: string;
    to: string;
    value: string;
    data?: string;
  }
}
