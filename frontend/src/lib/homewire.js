import { derived, writable } from 'svelte/store';

import * as App from '../../wailsjs/go/app/App';
import * as Wails from '../../wailsjs/runtime/runtime';
import localStorageStore from './localStorageStore';

/**
 * @typedef {import('../../wailsjs/go/models').app.WireInfo} AppWire
 *
 * @typedef {'not-joined' | 'joining' | 'joined' | 'join-failed'} JoinStatus
 * @typedef {'not-connected' | 'connecting' | 'connected' | 'connection-failed'} ConnectionStatus
 *
 * @typedef {{
 *  code: string;
 *  ttl: number;
 *  expiresAt: Date;
 * }} Otp
 *
 * @typedef {{
 *  id: string;
 *  name: string;
 *  joinStatus: JoinStatus;
 *  connectionStatus: ConnectionStatus;
 *  joined: boolean;
 * }} WireInfo
 */

/** @type {import('svelte/store').Writable<WireInfo[]>} */
const wires = writable([]);

/** @type {import('svelte/store').Writable<string>} */
const selectedWire = localStorageStore('HOMEWIRE_SELECTED_WIRE', '');

/** @type {import('svelte/store').Readable<WireInfo[]>} */
export const joinedWires = derived(wires, wires => wires.filter(wire => wire.joined));

/** @type {import('svelte/store').Readable<WireInfo[]>} */
export const nearbyWires = derived(wires, wires => wires.filter(wire => !wire.joined));

/** @type {import('svelte/store').Readable<WireInfo | null>} */
export const currentWire = derived([wires, selectedWire], ([wires, selectedWire]) => {
  if (!selectedWire) {
    return null;
  }

  return (wires || []).find(w => w.id === selectedWire);
});

/**
 * @param {AppWire} appWire
 */
function onWireChanged(appWire) {
  const wire = mapAppWireToWire(appWire);
  console.log('WIRE CHANGED', wire);

  wires.update(wires => {
    const newWires = [].concat(wires);

    const wireIdx = newWires.findIndex(w => w.id === wire.id);

    if (wireIdx < 0) {
      newWires.push(wire);
    } else {
      newWires[wireIdx] = wire;
    }

    return newWires;
  });
}

/**
 * @param {AppWire} appWire
 * @returns {WireInfo}
 */
function mapAppWireToWire(appWire) {
  const joinStatus = /** @type {JoinStatus} */ (appWire.joinStatus);
  const connectionStatus = /** @type {ConnectionStatus} */ (appWire.connectionStatus);
  return {
    id: appWire.id,
    name: appWire.name,
    joinStatus,
    connectionStatus,
    joined: joinStatus !== 'not-joined',
  };
}

export async function reloadWires() {
  const appWires = await App.ListWires();

  /** @type {WireInfo[]} */
  const newWires = appWires.map(appWire => mapAppWireToWire(appWire));

  wires.set(newWires);
}

/**
 * Selects a wire as the current wire
 *
 * @param {WireInfo} wire
 */
export function selectWire(wire) {
  if (wire.joined) {
    selectedWire.set(wire.id);
  }
}

/**
 * Creates a new wire
 * @param {string} name
 * @returns {Promise<WireInfo>}
 */
export async function createWire(name) {
  const newWire = await App.CreateNewWire(name);
  return mapAppWireToWire(newWire);
}

/**
 * Retrieves the current OTP code for the given wire
 *
 * @param {WireInfo} wire
 * @returns {Promise<Otp>}
 */
export async function getOtpCode(wire) {
  const otp = await App.GetWireOtp(wire.id);
  console.log(otp);
  return {
    code: otp.code,
    ttl: otp.ttl * 1000,
    expiresAt: new Date(otp.expiresAt),
  };
}

Wails.EventsOn('wire:changed', onWireChanged);
Wails.EventsOn('wire:discovered', onWireChanged);
