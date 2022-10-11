import { useEffect, useRef, useState } from "react";
import { RoomApi } from "./apiRoom";
import { RoomInit, RoomState } from "./types";

export function useDB(props: {
  init: RoomInit;
}) {
  const api = useRef(new RoomApi(props.init));
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
