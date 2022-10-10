import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { get, getDatabase, onDisconnect, onValue, ref, set, update } from "firebase/database";
import { RoomInit, RoomState, RoomUpdate, UserState } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyC6-Ia_K3-ZDkoxfLNUALK3SDHCeH4_0nw",
  authDomain: "planning-poker-994c5.firebaseapp.com",
  projectId: "planning-poker-994c5",
  storageBucket: "planning-poker-994c5.appspot.com",
  messagingSenderId: "481963696295",
  appId: "1:481963696295:web:6aae9109390cb528207b82",
  measurementId: "G-HJKY9SPZ1Y"
};

export class FirebaseApi {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(this.app);
  database = getDatabase(this.app);
  constructor(readonly init: RoomInit) {};

  async updateUser(user: Partial<UserState>): Promise<void> {
    const { init } = this;
    const userRef = ref(this.database, `rooms/${init.rid}/users/${init.uid}`);
    await update(userRef, user);
  }

  async updateRoom(room: Partial<RoomState>): Promise<void> {
    const { init } = this;
    const roomRef = ref(this.database, `rooms/${init.rid}`);
    await update(roomRef, room);
  }

  async connect(cb: RoomUpdate): Promise<void> {
    const { init } = this;
    const user: UserState = {
      uid: init.uid,
      name: '',
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
