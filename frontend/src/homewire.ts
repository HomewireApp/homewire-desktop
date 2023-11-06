import { createStore } from 'solid-js/store';
import type { wire } from '../wailsjs/go/models';
import { ListWires } from '../wailsjs/go/app/App';
import { createSignal } from 'solid-js';

export const [currentWire, setCurrentWire] = createSignal<wire.WireInfo>();

export function useHomewire() {
  const [wires, _setWires] = createStore<wire.WireInfo[]>([]);

  //EventsOn('wire:discovered', )

  return {
    wires,
  };
}

function reoderWireList(wires: wire.WireInfo[]): wire.WireInfo[] {
  const currentId = currentWire()?.id;

  if (!currentId) {
    return wires;
  }

  const currentWireIdx = wires.findIndex(w => w.id === currentId);
  if (currentWireIdx < 0) {
    return wires;
  }

  const wire = wires.splice(currentWireIdx, 1)[0];
  wires.unshift(wire);
  return wires;
}

export async function listWires(): Promise<wire.WireInfo[]> {
  const wires = await ListWires();
  return reoderWireList(wires);
}

export async function joinWire(id: string): Promise<wire.WireInfo[]> {
  // TODO impl this
  return await listWires();
}
