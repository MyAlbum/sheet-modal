import React, { Fragment, PropsWithChildren, useEffect, useMemo } from "react";
import { Portal, portalHosts } from "./lib/portalHosts";

type Props = {
  host?: string;
};

function PortalComponent(_props: PropsWithChildren<Props>) {
  const props = { host: "default", ..._props };
  const portal = useMemo(() => {
    const portalInstance = new Portal(props.children);
    const host = portalHosts.getHost(props.host!);

    if (!host) {
      throw new Error(`PortalHost with name ${props.host} does not exist`);
    } else {
      host.addPortal(portalInstance);
    }

    return portalInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.host]);

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
