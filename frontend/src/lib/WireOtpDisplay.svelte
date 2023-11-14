<script>
  import { onDestroy, onMount } from 'svelte';

  /** @type {import('./homewire').Otp} */
  export let otp;

  /** @type {(() => any) | null} */
  export let onExpire = null;

  let remainingTime = '';
  let progress = 100;

  /** @type {number} */
  let interval;

  let progressScale = 100;

  function tick() {
    const remaining = Math.max(0, otp.expiresAt.getTime() - Date.now());
    progress = Math.round(progressScale * remaining / otp.ttl);
    remainingTime = Math.round(remaining / 1000).toString();

    if (remaining <= 0) {
      onExpire && onExpire();
    }
  }

  onMount(() => {
    interval = setInterval(tick, 16);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="text-lg">{otp.code}</div>
<div class="text-center">{remainingTime}</div>
<progress class="progress progress-success w-100" value={progress} max={progressScale} />
