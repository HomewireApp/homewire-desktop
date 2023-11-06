import type { Component } from 'solid-js';
import { WireList } from './components/WireList';
import Bars3 from './icons/Bars3';
import { currentWire } from './homewire';

const App: Component = () => {
  return (
    <div class="drawer flex">
      <input id="wire-list-drawer" type="checkbox" class="drawer-toggle" />

      <header class="navbar bg-green-700 text-white px-4">
        <label class="btn btn-neutral btn-sm px-1 drawer-button" for="wire-list-drawer">
          <Bars3 />
        </label>
        <span class="text-md font-medium ml-3">{currentWire()?.name ?? 'Homewire'}</span>
      </header>

      <div class="drawer-side">
        <label aria-label="close sidebar" for="wire-list-drawer" class="drawer-overlay" />
        <WireList class="w-80 h-full" />
      </div>

      <main class="h-full drawer-content" />
    </div>
  );
};

export default App;
