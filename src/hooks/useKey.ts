import { useEffect } from "react";

export default function useKey(
  key: KeyboardEvent["key"],
  callback: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        e.stopPropagation();

        callback(e);
      }
    };

    window.addEventListener("keyup", onKey);

    return () => {
      window.removeEventListener("keyup", onKey);
    };
  }, [callback, key]);
}
