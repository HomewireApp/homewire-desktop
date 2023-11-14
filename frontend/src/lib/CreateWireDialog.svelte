<script>
  import { createWire } from './homewire';

  import Dialog from "./Dialog.svelte";
  import Empty from "./Empty.svelte";

  /** @type {((wire: import('./homewire').WireInfo) => void | Promise<void>) | undefined} */
  export let onSuccess = undefined;

  /**
   * @typedef {{
   *  name: string;
   * }} CreateWireFormInput
   */

  /** @type {HTMLFormElement} */
  let form;

  /** @type {Dialog} */
  let dialog;

  let isSubmitting = false;

  /** @type {CreateWireFormInput} */
  let data = {
    name: '',
  };

  function cancel() {
    form.reset();
    dialog.close();
  }

  /**
   * 
   * @param {SubmitEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
        const wire = await createWire(data.name);
        onSuccess && onSuccess(wire);
        cancel();
      } catch (err) {
        console.error('Failed to send message', err);
      }
  }

  export function open() {
    dialog.openModal();
  }
</script>

<Dialog bind:this={dialog} title='Create a New Wire'>
  <form bind:this={form} on:submit={handleSubmit}>
    <input
      type="text"
      class="input input-bordered w-full mt-4"
      name="name"
      placeholder="Wire name"
      id="createWireForm_name"
      disabled={isSubmitting}
      bind:value={data.name}
    />

    <div class="mt-4 flex">
      <div class="flex-1" />
      <button type="submit" class="btn btn-sm btn-primary" disabled={isSubmitting}>
        Submit
      </button>

      <button
        type="reset"
        class="btn btn-sm btn-outline btn-neutral ml-2"
        disabled={isSubmitting}
        on:click={cancel}>
        Cancel
      </button>
    </div>
  </form>

  <Empty slot="footer" />
</Dialog>
