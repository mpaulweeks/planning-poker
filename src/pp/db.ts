import { useRef, useState } from "react";
import { FirebaseApi } from "./api";
import { Database } from "./types";

export function useDB() {
  const api = useRef(new FirebaseApi());
  const [db, setDB] = useState<Database | null>();

  return {
    api,
    db,
  }
}
