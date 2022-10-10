export function Room(props: {
  rid: string;
  options: string[];
}) {
  return (
    <>
      <h1>
        {props.rid}
      </h1>
      <div>
        {props.options}
      </div>
    </>
  );
}
