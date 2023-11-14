<script>
  import { selectWire, currentWire } from './homewire';

  /** @type {import('./homewire').WireInfo} */
  export let wire;

  /** @type {boolean} */
  export let disabled = false;

  /** @type {(() => any) | undefined} */
  export let onClick = undefined;

  const BadgeContentByStatus = {
    joined: {
      label: 'Joined',
      color: 'badge-success',
    },
    joining: {
      label: 'Joining',
      color: 'badge-warning',
    },
    'join-failed': {
      label: 'Join Failed',
      color: 'badge-error',
    },
    'not-joined': {
      label: 'Not Joined',
      color: '',
    },
  };

  $: isSelected = $currentWire && wire && $currentWire.id && $currentWire.id === wire.id;
  $: badgeContent = BadgeContentByStatus[wire.joinStatus];

  function handleClick(e) {
    e.preventDefault();
    onClick && onClick();
  }
</script>

<li>
  <button
    type="button"
    class="flex flex-row align-center"
    on:click={handleClick}
    disabled={disabled}>
    {#if isSelected}
      <div class="absolute left-0 top-0 bottom-0 bg-primary w-1 rounded-sm" />
    {/if}

    <span class="flex-1">{wire.name}</span>
    <span class={`badge block badge-outline badge-sm ${badgeContent.color}`}>
      {badgeContent.label}
    </span>
  </button>
</li>
