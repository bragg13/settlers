import { IsString } from 'class-validator';

export class LobbyJoinDto {
  // @IsString()
  lobbyId: string;
  username: string;
  color: string;

  // @IsInt() -- todo: number of players in private
  // @Min(1)
  // @Max(5)
  // delayBetweenRounds: number;
}
