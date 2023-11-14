<script>
  import { currentWire, joinedWires, nearbyWires, selectWire } from './homewire';

  import WireListItem from './WireListItem.svelte';
  import CreateWireDialog from './CreateWireDialog.svelte';

  /** @type {CreateWireDialog} */
  let dialog;

  /**
   * @param {import('./homewire').WireInfo} wire
   */
  function onWireClicked(wire) {
    if (wire.joinStatus === 'not-joined') {
      try {
        // TODO IMPLEMENT THIS
      } catch (err) {
        console.error('Failed to join wire', wire.id, 'due to', err);
      }
    } else if (
      wire.joinStatus === 'joined' &&
      wire.connectionStatus === 'connected' &&
      wire.id !== $currentWire?.id
    ) {
      selectWire(wire);
    }
  }
</script>

<nav class="flex flex-col {$$props.class}">
  <ul class="menu flex-1 p-4 bg-base-200">
    <li>
      <div class="menu-title flex flex-row items-center">
        <h2 class="flex-1">My Wires</h2>
        <button class="btn btn-xs btn-primary" on:click={() => dialog.open()}>
          Create New
        </button>
      </div>
    </li>

    {#if $joinedWires.length > 0}
      {#each $joinedWires as wire}
        <WireListItem wire={wire} onClick={() => onWireClicked(wire)} />
      {/each}
    {:else}
      <li>
        You have not joined any wires
      </li>
    {/if}

    {#if $nearbyWires.length > 0}
      <li class="border-top">
        <div class="menu-title">
          <div class="divider my-2" />
          Nearby Wires
        </div>
      </li>
      {#each $nearbyWires as wire}
        <WireListItem wire={wire} />
      {/each}
    {/if}
  </ul>
</nav>

<CreateWireDialog bind:this={dialog} />
