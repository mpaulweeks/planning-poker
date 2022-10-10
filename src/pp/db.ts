import { useEffect, useRef, useState } from "react";
import { FirebaseApi } from "./firebase";
import { Room, RoomInit } from "./types";

export function useDB(props: {
  init: RoomInit;
}) {
  const api = useRef(new FirebaseApi());
  const [room, setRoom] = useState<Room | null>();

  useEffect(() => {
    (async() => {
      const data = await api.current.connect(props.init);
      setRoom(data);
    })();
  }, [setRoom]);

  return {
    api,
    room,
  }
}
