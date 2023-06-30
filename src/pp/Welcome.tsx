import { useState } from "react";
import { OptionsSeparator, QueryParams } from "../lib/types";
import styles from './Welcome.module.css';

export function Welcome() {
  const [room, setRoom] = useState('');
  const [options, setOptions] = useState('');

  const safeOptions = options.split(',').map(s => s.trim()).join(OptionsSeparator);
  const searchParams = new URLSearchParams();
  searchParams.append(QueryParams.Room, room);
  searchParams.append(QueryParams.Options, safeOptions);
  const url = searchParams.toString();
  console.log(url);

  return (
    <div className={styles.Welcome}>
      <h1>
        planning-poker
      </h1>
      <div>
        free website to <a href="https://en.wikipedia.org/wiki/Planning_poker">help with estimating</a>
        <br/>
        once you create a room, you can share the URL with your teammates
        <br/>
        you can also bookmark that URL for easy access in the future
      </div>
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
      <div>
        created by <a href="https://github.com/mpaulweeks/planning-poker">mpaulweeks</a>
      </div>
    </div>
  );
}
