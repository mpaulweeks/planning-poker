import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { get, getDatabase, onDisconnect, onValue, ref, remove, set, update } from "firebase/database";
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
    const lookup: { [key: string]: RoomState } | undefined = rooms.val();
    const states = Object.values(lookup ?? {});
    return states;
  }

  async removeEmptyRooms() {
    const rooms = await this.getRooms();
    for (const room of rooms) {
      const users = room.users ?? {};
      if (Object.keys(users).length === 0) {
        const roomRef = ref(this.database, `rooms/${room.rid}`);
        await remove(roomRef);
      }
    }
  }

  async resetRoom(init: RoomInit): Promise<void> {
    const roomRef = ref(this.database, `rooms/${init.rid}`);
    const room: RoomState = (await get(roomRef)).val();
    const users: UserState[] = Object.values(room.users ?? {});
    users.forEach(u => u.vote = null);
    await this.updateRoom(init, {
      users: room.users,
      reveal: false,
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
    await this.removeEmptyRooms();

    const user: UserState = {
      uid: init.uid,
      name: getStorageName(),
      spectate: false,
      vote: null,
    };

    const roomRef = ref(this.database, `rooms/${init.rid}`);
    const userRef = ref(this.database, `rooms/${init.rid}/users/${init.uid}`);
    onDisconnect(userRef).remove();

    const room = await get(roomRef);
    if (room.exists()) {
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
  }
}
