import { useEffect } from "react";

export default function useKey(
  key: KeyboardEvent["key"],
  callback: () => void
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        e.stopPropagation();

        callback();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [callback, key]);
}
