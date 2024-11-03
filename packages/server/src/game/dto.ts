import { Road, Spot } from '@settlers/shared';
import { IsString } from 'class-validator';

export class LobbyJoinDto {
  lobbyId: string;
  username: string;
  color: string;
}

export class SetupSettlementDto {
  spotId: Spot['id'];
}
export class SetupRoadDto {
  roadId: Road['id'];
}
