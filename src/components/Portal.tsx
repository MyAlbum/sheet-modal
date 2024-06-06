import { Portal } from "@gorhom/portal";
import React, { PropsWithChildren, useState } from "react";

// Gorhom's Portal component has a bug causing onLayout not being triggered on its children
function PortalWorkaround(props:PropsWithChildren) {
  const [portalReady, setPortalReady] = useState(false);

  return (
    <Portal
      handleOnMount={() => {
        setPortalReady(true);
      }}
      handleOnUnmount={() => {
        setPortalReady(false);
      }}
    >
      {portalReady && props.children}
    </Portal>
  );
}

export default PortalWorkaround;