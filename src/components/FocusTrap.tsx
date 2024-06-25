import React from "react";
import { default as _FocusTrap } from "focus-trap-react";

export default function FocusTrap(props: _FocusTrap.Props) {
  const { children, ...focusTrapOptions } = props;

  return <_FocusTrap {...focusTrapOptions}>{children}</_FocusTrap>;
}
