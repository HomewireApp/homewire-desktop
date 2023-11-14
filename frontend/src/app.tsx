import { useContext, type Component, createSignal, Show } from 'solid-js';
import { WireList } from './components/WireList';
import Bars3 from './icons/Bars3';
import type { OtpCodeResult } from './homewire';
import { Context, HomewireProvider } from './homewire';
import { ShowWireOtpDialog } from './components/ShowWireOtpDialog';

const AppInner: Component = () => {
  const homewire = useContext(Context);

  const [currentOtpResult, setCurrentOtpResult] = createSignal<OtpCodeResult | null>(null);

  async function showOtpDialog() {
    const wire = homewire.currentWire();
    if (!wire) {
      return;
    }

    try {
      const result = await homewire.getOtpCode(wire);
      setCurrentOtpResult(result);
      console.log('REZALTIM', result);
    } catch (err) {
      console.error('Failed to retrieve OTP for wire', wire.name, err);
    }
  }

  function onOtpDialogExpired() {
    console.log('EXPIRED');
    showOtpDialog();
  }

  function onOtpDialogClosed() {
    console.log('KLIOZ');
    setCurrentOtpResult(null);
  }

  return (
    <div class="drawer flex">
      <input id="wire-list-drawer" type="checkbox" class="drawer-toggle" />

      <header class="navbar bg-green-700 text-white px-4">
        <label class="btn btn-neutral btn-sm px-1 drawer-button" for="wire-list-drawer">
          <Bars3 />
        </label>
        <span class="text-md font-medium ml-3">{homewire.currentWire()?.name ?? 'Homewire'}</span>
        <div class="flex-1" />
        <button class="btn btn-xs btn-primary" onClick={() => showOtpDialog()}>
          QR
        </button>
      </header>

      <div class="drawer-side">
        <label aria-label="close sidebar" for="wire-list-drawer" class="drawer-overlay" />
        <WireList class="w-80 h-full" />
      </div>

      <main class="h-full drawer-content" />

      <Show when={currentOtpResult()}>
        {otpResult => (
          <ShowWireOtpDialog
            wire={homewire.currentWire()}
            result={otpResult}
            open={() => otpResult != null}
            onClose={() => onOtpDialogClosed()}
            onExpire={() => onOtpDialogExpired()}
          />
        )}
      </Show>
    </div>
  );
};

const App: Component = () => {
  return (
    <HomewireProvider>
      <AppInner />
    </HomewireProvider>
  );
};

export default App;
