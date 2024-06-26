import { Component, createEffect, createSignal, Setter, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

type ModalProps = {
  setOpen: Setter<boolean>;
};

type Props = {
  openComponent: Component<ModalProps>;
  children: Component<ModalProps>;
};

const Modal: Component<Props> = (props) => {
  const [open, setOpen] = createSignal(false);

  let modalRef: HTMLDivElement;

  createEffect(() => (open() ? disableScroll() : enableScroll()));

  const enableScroll = () => {
    document.body.classList.remove('no-scroll');
  };

  const disableScroll = () => {
    document.body.classList.add('no-scroll');
  };

  return (
    <>
      <props.openComponent setOpen={setOpen} />
      <Show when={open()}>
        <Portal>
          <div
            class="openModal"
            onClick={(e) => {
              if (!modalRef.contains(e.target)) {
                setOpen(false);
              }
            }}
          >
            <div
              ref={modalRef!}
              class="modal fixed min-w-160 top-14 left-2/4 p-8 -translate-x-1/2 rounded-2xl"
            >
              {props.children({ setOpen: setOpen })}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
};

export default Modal;
