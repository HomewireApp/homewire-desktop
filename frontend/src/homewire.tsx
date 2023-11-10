import type { Accessor, JSX } from 'solid-js';
import { createContext, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import type { app } from '../wailsjs/go/models';
import { CreateNewWire, ListWires } from '../wailsjs/go/app/App';
import { EventsOff, EventsOn } from '../wailsjs/runtime/runtime';

function noop(..._args: any[]): any {}

export type HomewireContext = {
  joinedWires: Accessor<app.WireInfo[]>;
  nearbyWires: Accessor<app.WireInfo[]>;
  currentWire: Accessor<app.WireInfo | null>;
  createWire: (name: string) => Promise<app.WireInfo>;
  selectWire: (wire: app.WireInfo) => void;
};

export const Context = createContext<HomewireContext>({
  joinedWires: () => [],
  nearbyWires: () => [],
  currentWire: () => null,
  createWire: noop,
  selectWire: noop,
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
    }
  }

  async function createWire(name: string): Promise<app.WireInfo> {
    const wire = await CreateNewWire(name);
    onWireChanged(wire);
    return wire;
  }

  const value: HomewireContext = {
    currentWire,
    joinedWires,
    nearbyWires,
    selectWire,
    createWire,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
