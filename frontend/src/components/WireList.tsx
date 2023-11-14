import type { JSX } from 'solid-js';
import { For, Show, Suspense, createSignal, useContext } from 'solid-js';
import { CreateWireDialog } from './CreateWireDialog';
import type { app } from '../../wailsjs/go/models';
import { Context } from '../homewire';

export type WireListProps = {
  class?: string;
};

type WireListItemProps = {
  wire: app.WireInfo;
  disabled?: boolean;
  current?: boolean;
  onClick?: (wire: app.WireInfo) => void | Promise<void>;
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

function NoWiresFoundMessage(props: { children?: JSX.Element | JSX.Element[] }) {
  return (
    <li>
      <div class="menu-title font-normal text-base text-sm mt-4">
        <Show when={props.children} fallback="No wires found">
          {props.children}
        </Show>
      </div>
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
  const badgeContent = BadgeContentByStatus[props.wire.connectionStatus] ?? {
    label: props.wire.connectionStatus,
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
  const homewire = useContext(Context);

  const [isCreateDialogOpen, setCreateDialogOpen] = createSignal<boolean>();

  function onWireClicked(wire: app.WireInfo) {
    if (wire.joinStatus === 'not-joined') {
      try {
        // TODO IMPLEMENT THIS
      } catch (err) {
        console.error('Failed to join wire', wire.id, 'due to', err);
      }
    } else if (
      wire.joinStatus === 'joined' &&
      wire.connectionStatus === 'connected' &&
      wire.id !== homewire.currentWire()?.id
    ) {
      homewire.selectWire(wire);
    }
  }

  function onCreateDialogOpened() {
    setCreateDialogOpen(true);
  }

  function onCreateCancelled() {
    setCreateDialogOpen(false);
  }

  async function onCreateSuccessful() {
    setCreateDialogOpen(false);
  }

  return (
    <div class={`flex flex-col ${props.class}`}>
      <Suspense fallback={<LoadingState />}>
        <ul class="menu flex-1 p-4 bg-base-200">
          <li>
            <div class="menu-title flex flex-row items-center">
              <h2 class="flex-1">My Wires</h2>
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

          <For
            each={homewire.joinedWires()}
            fallback={<NoWiresFoundMessage>You have not joined any Wires</NoWiresFoundMessage>}>
            {wire => (
              <WireListItem
                wire={wire}
                onClick={onWireClicked}
                disabled={wire.joinStatus === 'joining'}
                current={wire.id === homewire.currentWire()?.id}
              />
            )}
          </For>

          <Show when={homewire.nearbyWires().length > 0}>
            <li class="border-top">
              <div class="menu-title">
                <div class="divider my-2" />
                Nearby Wires
              </div>
            </li>
            <For each={homewire.nearbyWires()}>
              {wire => <WireListItem wire={wire} onClick={onWireClicked} />}
            </For>
          </Show>
        </ul>
      </Suspense>
    </div>
  );
}
