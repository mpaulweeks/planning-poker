import { useDB } from "../hooks/useDB";
import { RoomInit } from "../lib/types";
import styles from './Room.module.css';
import { getStorageName, setStorageName } from "../lib/localStorage";

export function Room(props: {
  init: RoomInit;
}) {
  const {api, room} = useDB(props);
  const user = (room?.users ?? {})[props.init.uid];
  if (!(room && user)) {
    return (
      <div className={styles.Loading}>
        loading {props.init.rid}
      </div>
    );
  }

  if (user.name !== getStorageName()) {
    setStorageName(user.name);
  }

  const users = Object.values(room.users ?? {});
  // for (let i = 0; i < 5; i++) {
  //   users.push({uid: i.toString(), name: 'r'+i, vote: null});
  // }

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
        <div style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
        }}>
          {room.rid}
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
          <div key={user.uid} className={styles.Vote} style={{
            borderColor: user.vote ? 'lightgreen' : 'salmon',
          }}>
            <div>
              {user.name ? user.name : <i>???</i>}
            </div>
            <div style={{ fontSize: '1.5em', }}>
              {!user.vote ? (
                <i>vote?</i>
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
        <div>
          <button onClick={() => api.current.resetRoom()}>
            RESET
          </button>
        </div>
      </footer>
    </div>
  );
}
