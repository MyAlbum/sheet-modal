import React from "react";
import { default as _FocusTrap } from "focus-trap-react";

export default function FocusTrap(props: _FocusTrap.Props) {
  return (
    <_FocusTrap
      {...props}
      ref={(ref: any) => {
        if (!ref) {
          return;
        }

        const t = ref.focusTrapElements[0];
        var focusable = t.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) {
          return;
        }

        requestAnimationFrame(() => {
          focusable[0]?.focus({ preventScroll: true });
        });
      }}
    />
  );
}
