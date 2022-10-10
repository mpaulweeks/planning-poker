import { useState } from "react";
import { OptionsSeparator } from "./types";
import styles from './Welcome.module.css';

export function Welcome() {
  const [room, setRoom] = useState('');
  const [options, setOptions] = useState('');

  const safeOptions = options.split(',').map(s => s.trim()).join(OptionsSeparator);
  const searchParams = new URLSearchParams();
  searchParams.append('room', room);
  searchParams.append('options', safeOptions);
  const url = searchParams.toString();
  console.log(url);

  return (
    <div className={styles.Welcome}>
      <h1>
        welcome
      </h1>
      <form onSubmit={evt => {
        evt.preventDefault();
        window.location.search = url;
      }}>
        <div>
          <label>
            room name:
            <br/>
            <input
              placeholder="e.g. cool guys"
              value={room}
              onChange={evt => setRoom(evt.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            comma seperated options:
            <br/>
            <input
              placeholder="e.g. 1,2,3,5,8"
              value={options}
              onChange={evt => setOptions(evt.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">
            create room
          </button>
        </div>
        </form>
    </div>
  );
}
