import { BP } from './BP';
import { BOK } from './BOK';
import { IP2 } from './IP2';
import { IP3 } from './IP3';
import { IT } from './IT';
import { LOCODE } from './LOCODE';
import { OL_ } from './OL_';
import { S_ } from './S_';
import { TR_ } from './TR_';

export * as ZIP from './zip';
export const CODE_SOURCE: { [key: string]: any[] } = {
  BOK,
  BP,
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
