import { For, Show, Suspense, createResource, createSignal, onCleanup, onMount } from 'solid-js';
import { CreateWireDialog } from './CreateWireDialog';
import * as Homewire from '../homewire';
import type { wire } from '../../wailsjs/go/models';

export type WireListProps = {
  class?: string;
};

type WireListItemProps = {
  wire: wire.WireInfo;
  disabled?: boolean;
  current?: boolean;
  onClick?: (wire: wire.WireInfo) => void | Promise<void>;
};

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

function NoWiresFoundMessage() {
  return (
    <li class="absolute inset-x-0 inset-y-24 flex items-center justify-center -z-1">
      <div class="menu-title text-base text-lg">No Wires found</div>
    </li>
  );
}

function LoadingState() {
  return (
    <div class="flex-1">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

function WireListItem(props: WireListItemProps) {
  const badgeContent = BadgeContentByStatus[props.wire.status] ?? {
    label: props.wire.status,
    color: '',
  };

  async function handleClick() {
    props.onClick && props.onClick(props.wire);
  }

  return (
    <li>
      <button
        type="button"
        class="flex flex-row align-center"
        onClick={handleClick}
        disabled={props.disabled}>
        <Show when={props.current}>
          <div class="absolute left-0 top-0 bottom-0 bg-primary w-1 rounded-sm" />
        </Show>

        <span class="flex-1">{props.wire.name}</span>
        <span class={`badge block badge-outline badge-sm ${badgeContent.color}`}>
          {badgeContent.label}
        </span>
      </button>
    </li>
  );
}

export function WireList(props: WireListProps) {
  const [isCreateDialogOpen, setCreateDialogOpen] = createSignal<boolean>();
  const [wires, { mutate }] = createResource(Homewire.listWires);
  const [refreshTimer, setRefreshTimer] = createSignal<any>(null);
  const [isJoiningWire, setJoiningWire] = createSignal<boolean>(false);

  function startRefreshTimer() {
    const newTimeout = setTimeout(async () => {
      await refreshList();
    }, 5000);

    setRefreshTimer(newTimeout);
  }

  function stopRefreshTimer() {
    clearTimeout(refreshTimer());
  }

  async function refreshList() {
    clearTimeout(refreshTimer());

    try {
      const newWires = await Homewire.listWires();
      mutate(newWires);
    } catch (err) {
      console.error('Failed to fetch wires', err);
    }

    startRefreshTimer();
  }

  function onCreateDialogOpened() {
    setCreateDialogOpen(true);
    stopRefreshTimer();
  }

  function onCreateCancelled() {
    setCreateDialogOpen(false);
    startRefreshTimer();
  }

  async function onCreateSuccessful() {
    setCreateDialogOpen(false);
    await refreshList();
  }

  async function onWireClicked(wire: wire.WireInfo) {
    let actualWire = wire;

    if (wire.status !== 'joined') {
      setJoiningWire(true);
      stopRefreshTimer();

      try {
        const newWires = await Homewire.joinWire(wire.id);
        actualWire = newWires.find(w => w.id === wire.id);
        mutate(newWires);
      } catch (err) {
        console.error('Failed to join wire', wire.id, 'due to', err);
        return;
      } finally {
        setJoiningWire(false);
        startRefreshTimer();
      }
    }

    Homewire.setCurrentWire(actualWire);
    await refreshList();
  }

  onMount(() => startRefreshTimer());

  onCleanup(() => stopRefreshTimer());

  return (
    <div class={`flex flex-col ${props.class}`}>
      <Suspense fallback={<LoadingState />}>
        <ul class="menu flex-1 p-4 bg-base-200 relative">
          <li>
            <div class="menu-title flex flex-row items-center">
              <h2 class="flex-1">Wire List</h2>
              <button class="btn btn-xs btn-primary" onClick={() => setCreateDialogOpen(true)}>
                Create New
              </button>
            </div>

            <CreateWireDialog
              open={isCreateDialogOpen}
              onOpen={onCreateDialogOpened}
              onCancel={onCreateCancelled}
              onSuccess={onCreateSuccessful}
            />
          </li>

          <For each={wires()} fallback={<NoWiresFoundMessage />}>
            {wire => (
              <WireListItem
                wire={wire}
                onClick={onWireClicked}
                disabled={isJoiningWire()}
                current={wire.id === Homewire.currentWire()?.id}
              />
            )}
          </For>
        </ul>
      </Suspense>
    </div>
  );
}
