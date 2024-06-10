import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { Portal, portalHosts } from "./lib/portalHosts";

type Props = {
  host?: string;
};

function PortalComponent(props: PropsWithChildren<Props>) {
  const [portal] = useState(
    (() => {
      const portalInstance = new Portal(props.children);
      const host = portalHosts.getHost(props.host!);

      if (!host) {
        throw new Error(`PortalHost with name ${props.host} does not exist`);
      } else {
        host.addPortal(portalInstance);
      }

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

PortalComponent.defaultProps = {
  host: "default",
};

export default PortalComponent;
