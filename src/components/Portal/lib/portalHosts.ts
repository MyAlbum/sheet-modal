import { ReactNode } from "react";

let portalId = 0;

class PortalHosts {
  hosts: { [key: string]: PortalHost } = {};

  addHost(name: string) {
    if (!this.hosts[name]) {
      this.hosts[name] = new PortalHost(name);
    }

    return this.hosts[name];
  }

  getHost(name: string) {
    return this.hosts[name];
  }
}

export const portalHosts = new PortalHosts();

type onChangeCallback = (portals: Portal[]) => void;

class PortalHost {
  name: string;
  portals: Portal[] = [];
  callbacks: onChangeCallback[] = [];

  constructor(name: string) {
    this.name = name;
    this.update = debounce(this.update, 16);
  }

  addPortal = (portal: Portal) => {
    portal.host = this;
    this.portals.push(portal);
    this.update();
  };

  onChange = (callback: onChangeCallback) => {
    this.callbacks.push(callback);
  };

  update = () => {
    this.callbacks.forEach((cb) => cb(this.portals));
  };

  removePortal = (portal: Portal) => {
    this.portals = this.portals.filter((p) => p !== portal);
    this.update();
  };
}

export class Portal {
  id;
  content: ReactNode;
  host: PortalHost | null = null;

  constructor(content: ReactNode) {
    this.id = portalId++;
    this.content = content;
  }

  setContent = (content: ReactNode) => {
    this.content = content;
  };

  remove = () => {
    this.host?.removePortal(this);
  };
}

const debounce = (fn: Function, time: number) => {
  let timeout: any;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, time);
  };
};
