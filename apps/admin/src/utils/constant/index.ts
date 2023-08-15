import { BOK } from './BOK';
import { BP } from './BP';
import { IC1 } from './IC1';
import { IC2 } from './IC2';
import { IDA_TYPE } from './IDA_TYPE';
import { IP2 } from './IP2';
import { IP3 } from './IP3';
import { IT } from './IT';
import { LOCODE } from './LOCODE';
import { OL_ } from './OL_';
import { S_ } from './S_';
import { TR_ } from './TR_';
export { TrackingCode } from './TrackingCode';

export function getLabel(params: any[], value: string) {
  return params?.find?.((item) => item?.value === value)?.label;
}

export * as ZIP from './zip';
export const CODE_SOURCE: { [key: string]: any[] } = {
  BOK,
  BP,
  IC1,
  IC2,
  IDA_TYPE,
  IP2,
  IP3,
  IT,
  LOCODE,
  OL_,
  S_,
  TR_,
  IN2: IP3, // IP3 = FR2 = IN2
  FR2: IP3, // IP3 = FR2 = IN2
};

export const STORAGE_KEY: string = 'SILKEN.';
export const AGENT_HAWB = {
  GROUP_NAME: [
    { value: '佐川ToC', label: '佐川ToC' },
    { value: '佐川ゆうパケット', label: '佐川ゆうパケット' },
    { value: 'ヤマトToC', label: 'ヤマトToC' },
    { value: 'ヤマトネコポス', label: 'ヤマトネコポス' },
  ],
  TRACKING_TYPE: [
    { value: 1, label: '自社' },
    { value: 2, label: '他社' },
  ],
};
