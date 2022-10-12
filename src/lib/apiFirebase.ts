import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { get, getDatabase, onDisconnect, onValue, ref, set, update } from "firebase/database";
import { FirebaseConfig } from "./config";
import { getStorageName } from "./localStorage";
import { RoomInit, RoomState, RoomUpdate, UserState } from "./types";

export class FirebaseApi {
  private static _instance: FirebaseApi | undefined;
  static get instance() {
    return this._instance ?? (this._instance = new FirebaseApi());
  }

  app = initializeApp(FirebaseConfig);
  analytics = getAnalytics(this.app);
  database = getDatabase(this.app);
  private constructor() {}

  async getRooms(): Promise<RoomState[]> {
    const roomsRef = ref(this.database, `rooms`);
    const rooms = await get(roomsRef);
    const lookup: { [key: string]: RoomState } = rooms.val();
    const states = Object.values(lookup);
    return states;
  }

  async resetRoom(init: RoomInit): Promise<void> {
    const roomRef = ref(this.database, `rooms/${init.rid}`);
    const room: RoomState = (await get(roomRef)).val();
    const users: UserState[] = Object.values(room.users ?? {});
    users.forEach(u => u.vote = null);
    await this.updateRoom(init, {
      users: room.users,
    });
  }

  async updateRoom(init: RoomInit, room: Partial<RoomState>): Promise<void> {
    const roomRef = ref(this.database, `rooms/${init.rid}`);
    await update(roomRef, room);
  }

  async updateUser(init: RoomInit, user: Partial<UserState>): Promise<void> {
    const userRef = ref(this.database, `rooms/${init.rid}/users/${init.uid}`);
    await update(userRef, user);
  }

  async connect(init: RoomInit, cb: RoomUpdate): Promise<void> {
    const user: UserState = {
      uid: init.uid,
      name: getStorageName(),
      vote: null,
    };

    const roomRef = ref(this.database, `rooms/${init.rid}`);
    const userRef = ref(this.database, `rooms/${init.rid}/users/${init.uid}`);
    onDisconnect(userRef).remove();

    const room = await get(roomRef);
    const match = room.exists() && (
      this.isArrayEqual((room.val() as RoomState).options, init.options)
    );
    if (match) {
      await set(userRef, user);
    } else {
      const newRoom: RoomState = {
        rid: init.rid,
        options: init.options,
        reveal: false,
        users: {
          [init.uid]: user,
        },
      };
      await set(roomRef, newRoom);
    }
    onValue(roomRef, snapshot => {
      cb(snapshot.val());
    });
    // const latest = await get(roomRef);
    // return latest.val() as RoomState;
  }

  private isArrayEqual(a: string[], b: string[]): boolean {
    return a.join(',') === b.join(',');
  }
}
