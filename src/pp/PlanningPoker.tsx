import { Room } from "./Room";
import { Welcome } from "./Welcome";

export function PlanningPoker() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get('room');
  const optionsStr = searchParams.get('options');
  const options = (optionsStr ?? '').split(',');

  if (room && options.length > 0) {
    return <Room rid={room} options={options} />;
  } else {
    return <Welcome />;
  }
}
