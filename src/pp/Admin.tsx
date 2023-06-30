import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { FirebaseApi } from '../lib/apiFirebase';
import { RoomState } from '../lib/types';

export function Admin() {
  const [rooms, setRooms] = useState<RoomState[]>();

  useEffect(() => {
    (async () => {
      await FirebaseApi.instance.removeEmptyRooms();
      const rooms = await FirebaseApi.instance.getRooms();
      setRooms(rooms);
    })()
  }, [setRooms]);

  return (
    <div className={styles.Admin}>
      <h1>
        Planning Poker Admin
      </h1>
      {rooms === undefined && (
        <div>
          loading...
        </div>
      )}
      {rooms && rooms.length === 0 && (
        <div>
          no rooms
        </div>
      )}
      {rooms && rooms.length > 0 && rooms.map(r => (
        <div key={r.rid}>
          <h1>
            {r.rid}
          </h1>
          <div>
            reveal: {r.reveal.toString()} options: {r.options.join(', ')}
          </div>
          {Object.values((r.users ?? {})).map(u => (
            <div key={u.uid}>
              {[u.uid, u.vote, u.spectate, u.name].join(' // ')}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
