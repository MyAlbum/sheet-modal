import React, { Fragment, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { portalHosts } from './lib/portalHosts';

type Props = {
  name?: string;
};

function PortalHost(_props: PropsWithChildren<Props>) {
  const props = { name: 'default', ..._props };
  const [host] = useState(portalHosts.addHost(props.name!));
  const [content, setContent] = useState<Array<ReactNode>>([]);

  useEffect(() => {
    host.onChange((p) => {
      setContent(p.map((portal) => portal.content));
    });
  }, [host]);

  return (
    <Fragment>
      {props.children}

      {content}
    </Fragment>
  );
}

export default PortalHost;
