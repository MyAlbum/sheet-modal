import React, {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { portalHosts } from "./lib/portalHosts";

type Props = {
  name?: string;
};

function PortalHost(props: PropsWithChildren<Props>) {
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

PortalHost.defaultProps = {
  name: "default",
};

export default PortalHost;
