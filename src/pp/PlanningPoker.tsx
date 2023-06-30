import { Admin } from "./Admin";
import { Room } from "./Room";
import { OptionsSeparator, QueryParams, RoomInit } from "../lib/types";
import { Welcome } from "./Welcome";

export function PlanningPoker() {
  const searchParams = new URLSearchParams(window.location.search);
  const admin = searchParams.get(QueryParams.Admin);
  if (admin) {
    return <Admin />
  }

  const rid = searchParams.get(QueryParams.Room);
  const optionsStr = searchParams.get(QueryParams.Options);
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
