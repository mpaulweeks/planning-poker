import { FirebaseApi } from "./apiFirebase";
import { RoomInit, RoomState, RoomUpdate, UserState } from "./types";

export class RoomApi {
  constructor(readonly init: RoomInit) {};

  updateUser(user: Partial<UserState>): Promise<void> {
    return FirebaseApi.instance.updateUser(this.init, user);
  }

  updateRoom(room: Partial<RoomState>): Promise<void> {
    return FirebaseApi.instance.updateRoom(this.init, room);
  }

  connect(cb: RoomUpdate): Promise<void> {
    return FirebaseApi.instance.connect(this.init, cb);
  }
}
