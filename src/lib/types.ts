export const OptionsSeparator = '-';

export interface UserState {
  uid: string;
  name: string;
  spectate: boolean;
  vote: string | null;
}

export interface RoomInit {
  uid: string;
  rid: string;
  options: string[];
}

export interface RoomState {
  rid: string;
  options: string[];
  reveal: boolean;
  users: {
    [key: string]: UserState;
  } | undefined;
}
export type RoomUpdate = (state: RoomState) => void;

export interface Database {
  rooms: {
    [key: string]: RoomState;
  }
}
