import { createForm } from '@felte/solid';
import type { Accessor } from 'solid-js';
import { createEffect, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { app } from '../../wailsjs/go/models';
import { Context } from '../homewire';

export type CreateWireDialogProps = {
  open: Accessor<boolean>;
  onOpen?: () => void;
  onSuccess?: (wire: app.WireInfo) => void;
  onCancel?: () => void;
};

export type CreateWireInputs = {
  name: string;
};

export function CreateWireDialog(props: CreateWireDialogProps) {
  let ref: HTMLDialogElement;
  const homewire = useContext(Context);

  const { form, isSubmitting, reset } = createForm<CreateWireInputs>({
    onSubmit: async data => {
      try {
        const wire = await homewire.createWire(data.name);

        ref.close();

        props.onSuccess && props.onSuccess(wire);

        reset();
      } catch (err) {
        console.error('Failed to send message', err);
      }
    },
  });

  createEffect(() => {
    if (props.open() && ref && !ref.open) {
      ref.showModal();
      props.onOpen && props.onOpen();
    }
  });

  function cancel() {
    ref.close();

    props.onCancel && props.onCancel();
  }

  return (
    <Portal>
      <dialog ref={ref} id="createWireDialog" class="modal" onCancel={e => e.preventDefault()}>
        <div class="modal-box">
          <h3 class="font-bold text-lg">Create a new Wire</h3>
          <form use:form>
            <input
              type="text"
              class="input input-bordered w-full mt-4"
              name="name"
              placeholder="Wire name"
              id="createWireForm_name"
              disabled={isSubmitting()}
            />

            <div class="mt-4 flex">
              <div class="flex-1" />
              <button type="submit" class="btn btn-sm btn-primary" disabled={isSubmitting()}>
                Submit
              </button>

              <button
                type="reset"
                class="btn btn-sm btn-outline btn-neutral ml-2"
                disabled={isSubmitting()}
                onClick={cancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </Portal>
  );
}
