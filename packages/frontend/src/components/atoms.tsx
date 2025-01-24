import { atom } from 'jotai';
import { Tile, Spot, Road } from '@settlers/shared';

export const tilesAtom = atom<Tile[]>([]);
export const spotsAtom = atom<Spot[]>([]);
export const roadsAtom = atom<Road[]>([]);
