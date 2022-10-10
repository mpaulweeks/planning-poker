import { useDB } from "./db";
import { RoomInit } from "./types";

export function Room(props: {
  init: RoomInit;
}) {
  const {api, room} = useDB(props);

  if (!room) {
    return <h1>loading {props.init.rid}</h1>;
  }
  return (
    <>
      <h1>
        {room.rid}
      </h1>
      <div>
        {room.options.join(', ')}
      </div>
    </>
  );
}
