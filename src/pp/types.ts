export interface Player {
  pid: string;
  name: string;
  vote: string | null;
}

export interface Room {
  rid: string;
  options: string[];
  reveal: boolean;
  players: {
    [key: string]: Player;
  }
}

export interface Database {
  rooms: {
    [key: string]: Room;
  }
}
