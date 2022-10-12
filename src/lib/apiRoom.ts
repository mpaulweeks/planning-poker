import { FirebaseApi } from "./apiFirebase";
import { RoomInit, RoomState, RoomUpdate, UserState } from "./types";

export class RoomApi {
  constructor(readonly init: RoomInit) {};

  resetRoom(): Promise<void> {
    return FirebaseApi.instance.resetRoom(this.init);
  }
  updateRoom(room: Partial<RoomState>): Promise<void> {
    return FirebaseApi.instance.updateRoom(this.init, room);
  }
  updateUser(user: Partial<UserState>): Promise<void> {
    return FirebaseApi.instance.updateUser(this.init, user);
  }

  connect(cb: RoomUpdate): Promise<void> {
    return FirebaseApi.instance.connect(this.init, cb);
  }
}
