import { BP } from './BP';
import { IP2 } from './IP2';
import { IP3 } from './IP3';
import { LOCODE } from './LOCODE';
import { OL_ } from './OL_';
import { S_ } from './S_';

export * as ZIP from './zip';
export const CODE_SOURCE: { [key: string]: any[] } = { BP, IP2, IP3, LOCODE, OL_, S_ };

export const STORAGE_KEY: string = 'SILKEN.';
