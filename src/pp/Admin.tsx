import { useEffect, useRef, useState } from 'react';
import styles from './Admin.module.css';
import { FirebaseApi } from '../lib/apiFirebase';
import { RoomState } from '../lib/types';

export function Admin() {
  const [rooms, setRooms] = useState<RoomState[]>();

  useEffect(() => {
    (async () => {
      const rooms = await FirebaseApi.instance.getRooms();
      setRooms(rooms);
    })()
  }, [setRooms]);

  console.log(rooms);

  return (
    <div className={styles.Admin}>
      {rooms ? rooms.map(r => (
        <div key={r.rid}>
          <h1>
            {r.rid}
          </h1>
          <div>
            reveal: {r.reveal.toString()} options: {r.options.join(', ')}
          </div>
          {Object.values((r.users ?? {})).map(u => (
            <div key={u.uid}>
              {u.uid} {u.name} {u.vote}
            =</div>
          ))}
        </div>
      )) : (
        <div>
          loading...
        </div>
      )}
    </div>
  )
}
