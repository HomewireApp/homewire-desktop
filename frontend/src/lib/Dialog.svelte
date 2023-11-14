<script>
  /** @type {boolean} */
  export let open = false;

  /** @type {(() => any) | null} */
  export let onClose = null;

  /** @type {string | undefined} */
  export let title = undefined;

  /** @type {HTMLDialogElement} */
  let dialog;

  function handleClose() {
    open = false;
    onClose && onClose();
  }

  export function openModal() {
    dialog.showModal();
  }

  export function close() {
    dialog && dialog.close();
  }

  $: if (dialog && open) openModal();
</script>

<dialog
  bind:this={dialog}
  id={$$props.id}
  class="modal"
  on:close={() => handleClose()}>
  <div class="modal-box">
    <slot name="header" dialog={dialog}>
      <h3 class="font-bold text-lg">{title}</h3>
    </slot>

    <div>
      <slot dialog={dialog} />
    </div>

    <slot name="footer" dialog={dialog}>
      <div class="mt-4 flex">
        <div class="flex-1" />
        <button type="button" class="btn btn-sm btn-outline btn-neutral ml-2" on:click={() => dialog.close()}>
          Close
        </button>
      </div>
    </slot>
  </div>
</dialog>
