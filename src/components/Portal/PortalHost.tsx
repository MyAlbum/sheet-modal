import React, { Fragment, PropsWithChildren, useEffect, useState } from 'react';
import { portalHosts } from './lib/portalHosts';

type Props = {
  name: string;
}

function PortalHost(props:PropsWithChildren<Props>) {
  const [host] = useState(portalHosts.addHost(props.name));
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    host.onChange((p) => {
      setContent(p.map(p => p.content));
    });
  }, [host]);

  return (
    <Fragment>
      {props.children}
      
      {content}
    </Fragment>
  )
}

export default PortalHost;