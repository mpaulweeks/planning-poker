import { Admin } from "./Admin";
import { Room } from "./Room";
import { OptionsSeparator, RoomInit } from "../lib/types";
import { Welcome } from "./Welcome";

export function PlanningPoker() {
  const searchParams = new URLSearchParams(window.location.search);
  const admin = searchParams.get('admin');
  if (admin) {
    return <Admin />
  }

  const rid = searchParams.get('room');
  const optionsStr = searchParams.get('options');
  const options = (optionsStr ?? '').split(OptionsSeparator);
  const uid = new Date().getTime().toString();

  if (rid && options.length > 0) {
    const init: RoomInit = {
      uid,
      rid,
      options,
    }
    return <Room init={init} />;
  } else {
    return <Welcome />;
  }
}
