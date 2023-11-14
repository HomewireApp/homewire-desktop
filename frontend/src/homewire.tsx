import type { Accessor, JSX } from 'solid-js';
import { createContext, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import type { app } from '../wailsjs/go/models';
import { CreateNewWire, ListWires } from '../wailsjs/go/app/App';
import { EventsOff, EventsOn } from '../wailsjs/runtime/runtime';

const StorageKeys = {
  currentWireId: 'homewire:current',
};

export type OtpCodeResult = {
  code: string;
  ttl: number;
  expiresAt: Date;
};

function noop(..._args: any[]): any {}

export type HomewireContext = {
  joinedWires: Accessor<app.WireInfo[]>;
  nearbyWires: Accessor<app.WireInfo[]>;
  currentWire: Accessor<app.WireInfo | null>;
  createWire: (name: string) => Promise<app.WireInfo>;
  selectWire: (wire: app.WireInfo) => void;
  getOtpCode: (wire: app.WireInfo) => Promise<OtpCodeResult>;
};

export const Context = createContext<HomewireContext>({
  joinedWires: () => [],
  nearbyWires: () => [],
  currentWire: () => null,
  createWire: noop,
  selectWire: noop,
  getOtpCode: noop,
});

function sortWiresByName(a: app.WireInfo, b: app.WireInfo) {
  return a.name.localeCompare(b.name);
}

export function HomewireProvider(props: { children?: JSX.Element | JSX.Element[] }) {
  const [wires, setWires] = createSignal<app.WireInfo[]>([]);
  const [currentWire, setCurrentWire] = createSignal<app.WireInfo | null>(null);

  const joinedWires = createMemo(() => {
    return wires()
      .filter(wire => wire.joinStatus !== 'not-joined')
      .sort(sortWiresByName);
  });

  const nearbyWires = createMemo(() => {
    return wires()
      .filter(wire => wire.joinStatus === 'not-joined')
      .sort(sortWiresByName);
  });

  onMount(async () => {
    EventsOn('wire:changed', onWireChanged);
    EventsOn('wire:discovered', onWireChanged);

    try {
      const wires = await ListWires();
      setWires(wires);

      const currentId = localStorage.getItem(StorageKeys.currentWireId) ?? '';
      const selectedWire = wires.find(w => w.id === currentId);
      if (selectWire) {
        setCurrentWire(selectedWire);
      }
    } catch (err) {
      console.error('Failed to fetch wires', err);
    }
  });

  onCleanup(() => {
    EventsOff('wire:changed');
  });

  function onWireChanged(wire: app.WireInfo) {
    console.log('WIRE CHANGED', wire);
    const newWires = [].concat(wires());

    const wireIdx = newWires.findIndex(w => w.id === wire.id);

    if (wireIdx < 0) {
      newWires.push(wire);
    } else {
      newWires[wireIdx] = wire;
    }

    setWires(newWires);
  }

  function selectWire(wire: app.WireInfo) {
    if (wire.joinStatus === 'joined') {
      setCurrentWire(wire);
      localStorage.setItem('homewire:current', wire.id);
    }
  }

  async function createWire(name: string): Promise<app.WireInfo> {
    const wire = await CreateNewWire(name);
    onWireChanged(wire);
    return wire;
  }

  async function getOtpCode(_wire: app.WireInfo): Promise<OtpCodeResult> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      code: '123123',
      expiresAt: new Date(Date.now() + 113_000),
      ttl: 120_000,
    };
  }

  const value: HomewireContext = {
    currentWire,
    joinedWires,
    nearbyWires,
    selectWire,
    createWire,
    getOtpCode,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
