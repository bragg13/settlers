import { atom } from 'jotai';
import { Spot, Road, ClientTile } from '@settlers/shared';

export const tilesAtom = atom<ClientTile[]>([]);
export const spotsAtom = atom<Spot[]>([]);
export const roadsAtom = atom<Road[]>([]);
