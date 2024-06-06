import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { Portal, portalHosts } from "./lib/portalHosts";

type Props = {
  host: string;
};

function PortalComponent(props: PropsWithChildren<Props>) {
  const [portal] = useState(
    (() => {
      const portalInstance = new Portal(props.children);
      portalHosts.getHost(props.host).addPortal(portalInstance);

      return portalInstance;
    })()
  );

  useEffect(() => {
    return () => {
      portal.remove();
    };
  }, [portal]);

  useEffect(() => {
    portal.setContent(<Fragment key={portal.id}>{props.children}</Fragment>);
  }, [portal, props.children]);

  return null;
}

export default PortalComponent;
