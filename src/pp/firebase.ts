import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { get, getDatabase, onDisconnect, ref, set } from "firebase/database";
import { Room, RoomInit, User } from "./types";

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
  uid = new Date().getTime().toString();

  async connect(init: RoomInit): Promise<Room> {
    const user: User = {
      uid: this.uid,
      name: '',
      vote: null,
    };

    const roomRef = ref(this.database, `rooms/${init.rid}`);
    const userRef = ref(this.database, `rooms/${init.rid}/users/${this.uid}`);
    onDisconnect(userRef).remove();

    const room = await get(roomRef);
    const match = room.exists() && (
      this.isArrayEqual((room.val() as Room).options, init.options)
    );
    if (match) {
      await set(userRef, user);
    } else {
      const newRoom: Room = {
        rid: init.rid,
        options: init.options,
        reveal: false,
        users: {
          [this.uid]: user,
        },
      };
      await set(roomRef, newRoom);
    }
    const latest = await get(roomRef);
    return latest.val() as Room;
  }

  private isArrayEqual(a: string[], b: string[]): boolean {
    return a.join(',') === b.join(',');
  }
}
