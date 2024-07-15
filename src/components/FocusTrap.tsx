import { default as _FocusTrap } from 'focus-trap-react';
import React from 'react';

export type FocusTrapProps = _FocusTrap.Props;
export type FocusTrapOptions = _FocusTrap.Props['focusTrapOptions'];

export default function FocusTrap(props: FocusTrapProps) {
  const { children, ...focusTrapOptions } = props;

  return <_FocusTrap {...focusTrapOptions}>{children}</_FocusTrap>;
}
