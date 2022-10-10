export interface User {
  uid: string;
  name: string;
  vote: string | null;
}

export interface RoomInit {
  rid: string;
  options: string[];
}

export interface Room {
  rid: string;
  options: string[];
  reveal: boolean;
  users: {
    [key: string]: User;
  }
}

export interface Database {
  rooms: {
    [key: string]: Room;
  }
}
