import { useDB } from "./db";
import { RoomInit } from "./types";
import styles from './Room.module.css';

export function Room(props: {
  init: RoomInit;
}) {
  const {api, room} = useDB(props);
  const user = room?.users[props.init.uid];
  if (!(room && user)) {
    return <h1>loading {props.init.rid}</h1>;
  }

  const users = Object.values(room.users);
  console.log(users);

  for (let i = 0; i < 5; i++) {
    // users.push({uid: i.toString(), name: 'r'+i, vote: null});
  }

  const voteNums = users.map(u => {
    const { vote } = u;
    if (!vote) { return NaN; }
    const num = parseInt(vote);
    return num;
  }).filter(v => !isNaN(v));
  const average = voteNums.reduce((sum, elm) => sum + elm, 0) / voteNums.length;

  return (
    <div className={styles.Room}>
      <header>
        <div>
          <b>{room.rid}</b>
        </div>
        <div className={styles.Self}>
          <input
            value={user.name}
            placeholder="your name here"
            onChange={evt => api.current.updateUser({
              name: evt.target.value,
            })} />
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
      </header>
      <section>
        {users.map(user => (
          <div key={user.uid} className={styles.Vote}>
            <div>
              {user.name ? user.name : <i>???</i>}
            </div>
            <div>
              {!user.vote ? (
                <i>pending</i>
              ) : (
                <b>
                  {room.reveal ? user.vote : 'ready'}
                </b>
              )}
            </div>
          </div>
        ))}
      </section>
      <footer>
        {(room.reveal && average > 0) ? (
          <div>
            Average: {average.toFixed(1)}
          </div>
        ) : ''}
        <div>
          <button onClick={() => api.current.updateRoom({
            reveal: !room.reveal,
          })}>
            {room.reveal ? 'HIDE': 'REVEAL'}
          </button>
        </div>
      </footer>
    </div>
  );
}
