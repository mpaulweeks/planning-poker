import { useDB } from "../hooks/useDB";
import { RoomInit, UserState } from "../lib/types";
import styles from './Room.module.css';
import { getStorageName, setStorageName } from "../lib/localStorage";
import { CSSProperties } from "react";
import { CopyToClipboard } from "./CopyToClipboard";

const hasVote = (arg: (string | null)): arg is string => arg !== null;

export function Room(props: {
  init: RoomInit;
}) {
  const {api, room} = useDB(props);
  const thisUser = (room?.users ?? {})[props.init.uid];
  if (!(room && thisUser)) {
    return (
      <div className={styles.Loading}>
        loading {props.init.rid}
      </div>
    );
  }

  if (thisUser.name !== getStorageName()) {
    setStorageName(thisUser.name);
  }

  const users = Object.values(room.users ?? {});
  const votes = users.map(u => {
    const { spectate, vote } = u;
    if (spectate) { return null; }
    if (!vote) { return null; } // coerce falsey (empty or undefined) to null
    return vote;
  }).filter(hasVote);
  const voteNums = votes.map(v => parseInt(v)).filter(v => !isNaN(v));
  const average = voteNums.reduce((sum, elm) => sum + elm, 0) / voteNums.length;

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${Math.min(users.length, 3)}, 1fr)`,
  };
  function userToColor(user: UserState, opacity?: string): string {
    return (
      (user.spectate && '#808080') || // grey
      (user.vote && '#90EE90') || // lightgreen
      '#FA8072' // salmon
    ) + (opacity ?? '');
  }

  return (
    <div className={styles.Room}>
      <header>
        <div style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
        }}>
          {room.rid}
        </div>

        <section>
          <input
            value={thisUser.name}
            placeholder="your name here"
            onChange={evt => api.current.updateUser({
              name: evt.target.value,
            })} />
          {room.options.map((vote, vi) => (
            <button
              key={vi}
              style={(!thisUser.spectate && vote === thisUser.vote) ? {
                border: '2px solid green',
              } : {}}
              onClick={() => api.current.updateUser({
                spectate: false,
                vote: vote === thisUser.vote ? null : vote,
              })}
            >
              {vote}
            </button>
          ))}
          <button
            style={(thisUser.spectate) ? {
              border: '2px solid green',
            } : {}}
            onClick={() => api.current.updateUser({
              spectate: thisUser.spectate ? false : true,
              vote: null,
            })}
          >
            SPECTATE
          </button>
        </section>

        <section>
          <div>
            <button
              disabled={!room.reveal && votes.length === 0}
              onClick={() => api.current.updateRoom({
                reveal: !room.reveal,
              })}
            >
              {room.reveal ? 'HIDE': 'REVEAL'}
            </button>
          </div>
          <div>
            <button
              disabled={votes.length === 0}
              onClick={() => api.current.resetRoom()}
            >
              RESET
            </button>
          </div>
          <div>
            <button onClick={() => window.location.href = window.location.href.split('?')[0]}>
              EXIT
            </button>
          </div>
        </section>
      </header>

      <main style={gridStyle}>
        {users.map(user => (
          <div key={user.uid} className={styles.Vote} style={{
            borderColor: userToColor(user),
            backgroundColor: userToColor(user, '33'), // 33 = 51 in hex = 20%
          }}>
            <div>
              {user.name ? user.name : <i>???</i>}
            </div>
            <div style={{ fontSize: '1.5em', }}>
              {user.spectate && (
                <i>abstain</i>
              )}
              {!user.spectate && !user.vote && (
                <i>vote?</i>
              )}
              {!user.spectate && user.vote && (
                <b>
                  {room.reveal ? user.vote : 'ready'}
                </b>
              )}
            </div>
          </div>
        ))}
        {(room.reveal && average > 0) ? (
          <aside>
            <div>
              Average
              <br/>
              <b>{average.toFixed(1)}</b>
            </div>
          </aside>
        ) : ''}
      </main>
      <CopyToClipboard toCopy={window.location.href} />
    </div>
  );
}
