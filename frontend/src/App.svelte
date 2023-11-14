<script>
  import './lib/wails-mock';

  import Bars from './icons/Bars.svelte';
  import WireList from './lib/WireList.svelte';

  import { reloadWires, currentWire, getOtpCode } from './lib/homewire';
    import Dialog from './lib/Dialog.svelte';

  import WireOtpDisplay from './lib/WireOtpDisplay.svelte';

  /** @type {import('./lib/homewire').Otp | null} */
  let otp = null;

  let isOtpDialogOpen = false;

  reloadWires();

  async function showOtpDialog() {
    const wire = $currentWire;
    if (!wire) {
      return;
    }

    try {
      if (!otp || otp.expiresAt < new Date()) {
        otp = await getOtpCode(wire);
      }

      isOtpDialogOpen = true;
    } catch (err) {
      console.error('Failed to retrieve OTP for wire', wire.name, err);
    }
  }

  $: $currentWire, otp = null
</script>

<main data-theme="skeleton" class="variant-filled-surface bg-surface-800 h-full">
  <div class="drawer flex">
    <input id="wire-list-drawer" type="checkbox" class="drawer-toggle" />

    <header class="navbar bg-green-700 text-white px-4">
      <label class="btn btn-neutral btn-sm px-1 drawer-button" for="wire-list-drawer">
        <Bars />
      </label>
      <span class="text-md font-medium ml-3">{$currentWire?.name ?? 'Homewire'}</span>
      <div class="flex-1" />
      <button class="btn btn-xs btn-primary" on:click={showOtpDialog}>
        QR
      </button>

      {#if otp}
        <Dialog open={isOtpDialogOpen} onClose={() => isOtpDialogOpen = false} title={`${$currentWire.name} Authentication Token`}>
          {#if isOtpDialogOpen}
            <WireOtpDisplay otp={otp} onExpire={() => showOtpDialog()} />
          {/if}
        </Dialog>
      {/if}
    </header>

    <div class="drawer-side">
      <label aria-label="close sidebar" for="wire-list-drawer" class="drawer-overlay" />
      <WireList class="w-80 h-full" />
    </div>
  </div>
</main>
