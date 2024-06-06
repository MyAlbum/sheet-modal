import React, { Fragment, PropsWithChildren, useEffect, useState } from 'react';
import { Portal, portalHosts } from './lib/portalHosts';

type Props = {
  host: string;
}

function PortalComponent(props: PropsWithChildren<Props>) {
  const [portal] = useState((() => {
    const portal = new Portal(props.children)
    portalHosts.getHost(props.host).addPortal(portal);

    return portal;
  })());

  useEffect(() => {
    return () => {
      portal.remove();
    }
  }, []);

  useEffect(() => {
    portal.setContent(<Fragment key={portal.id}>{props.children}</Fragment>);
  }, [props.children]);

  return null;
}


export default PortalComponent;