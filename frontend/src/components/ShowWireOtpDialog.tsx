import type { Accessor } from 'solid-js';
import { Suspense, createEffect, createSignal, onCleanup } from 'solid-js';
import type { OtpCodeResult } from '../homewire';
import type { app } from '../../wailsjs/go/models';

export type ShowWireOtpDialogProps = {
  wire: app.WireInfo;
  result: Accessor<OtpCodeResult>;
  open: Accessor<boolean>;
  onClose?: () => void;
  onExpire?: () => void;
};

export function ShowWireOtpDialog(props: ShowWireOtpDialogProps) {
  let ref: HTMLDialogElement;

  const [updater, setUpdater] = createSignal<NodeJS.Timeout>();
  const [terminator, setTerminator] = createSignal<NodeJS.Timeout>();
  const [progress, setProgress] = createSignal<number>(100);
  const [remainingTime, setRemainingTime] = createSignal<string>();

  function setupTimers(result: OtpCodeResult) {
    clearInterval(updater());
    clearTimeout(terminator());

    const now = Date.now();

    const newUpdater = setInterval(() => {
      const remaining = Math.max(0, result.expiresAt.getTime() - now);
      setRemainingTime(Math.round(remaining / 60).toString());
      setProgress(Math.round((100 * remaining) / result.ttl));
    }, 1_000);

    const newTerminator = setTimeout(() => {
      resetTimers();
      props.onExpire && props.onExpire();
    }, result.expiresAt.getTime() - now);

    setUpdater(newUpdater);
    setTerminator(newTerminator);
  }

  function resetTimers() {
    clearInterval(updater());
    clearTimeout(terminator());
  }

  onCleanup(() => {
    resetTimers();
  });

  createEffect(() => {
    if (props.open() && ref) {
      ref.showModal();
      setupTimers(props.result());
    }

    /*if (props.result) {
      setupTimers(props.result());
    } else {
      resetTimers();
    }*/
  });

  function cancel() {
    //resetTimers();
    ref.close();
    props.onClose && props.onClose();
  }

  return (
    <dialog
      ref={ref}
      id="showWireOtpDialog"
      class="modal"
      onCancel={e => e.preventDefault()}
      onClose={() => cancel()}>
      <div class="modal-box">
        <h3 class="font-bold text-lg">{props.wire.name} Authentication Token</h3>

        <div>
          <div class="text-lg">{props.result().code}</div>
          <div class="text-center">{remainingTime()}</div>
          <progress class="progress progress-success w-100" value={progress()} max={100} />
        </div>

        <div class="mt-4 flex">
          <div class="flex-1" />
          <button type="button" class="btn btn-sm btn-outline btn-neutral ml-2" onClick={cancel}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
