import { useDB } from "./db";
import { RoomInit } from "./types";

export function Room(props: {
  init: RoomInit;
}) {
  const {api, room} = useDB(props);
  const user = room?.users[props.init.uid];
  if (!(room && user)) {
    return <h1>loading {props.init.rid}</h1>;
  }

  return (
    <>
      <h1>
        {room.rid}
      </h1>
      <div>
        {room.options.map((vote, vi) => (
          <button
            key={vi}
            style={vote === user.vote ? {
              border: '2px solid green',
            } : {}}
            onClick={() => api.current.updateUser({
              vote: vote === user.vote ? null : vote,
            })}
          >
            {vote}
          </button>
        ))}
      </div>
    </>
  );
}
