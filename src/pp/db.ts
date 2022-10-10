import { useEffect, useRef, useState } from "react";
import { FirebaseApi } from "./firebase";
import { RoomInit, RoomState } from "./types";

export function useDB(props: {
  init: RoomInit;
}) {
  const api = useRef(new FirebaseApi(props.init));
  const [room, setRoom] = useState<RoomState | null>();

  useEffect(() => {
    (async() => {
      await api.current.connect(state => setRoom(state));
    })();
  }, [setRoom]);

  return {
    api,
    room,
  }
}
