import { FaRegularImage } from 'solid-icons/fa';
import { useAuthState } from '../../context/auth';
import useMessenger from '../../hooks/useMessenger';
import { GFileEvent, GInputEvent } from '../../types/Form';
import { Glide } from '../../types/Glide';
import { Component, JSX, mergeProps, Show } from 'solid-js';
import Button from './Button';
import ChangeEventHandlerUnion = JSX.ChangeEventHandlerUnion;

type Props = {
  onGlideAdded: (g?: Glide) => void;
  showAvatar?: boolean;
  answerTo?: string;
};

const Messenger: Component<Props> = (initialProps) => {
  const props = mergeProps({ showAvatar: true }, initialProps);

  const { user } = useAuthState()!;
  const { handleInput, handleSubmit, form, loading } = useMessenger(props.answerTo);

  const sendDisabled = () => loading() || form.content === '';

  const autosize = (e: GInputEvent) => {
    const el = e.currentTarget;

    el.style.height = '0px';
    const scrollHeight = el.scrollHeight;
    el.style.height = scrollHeight + 'px';
  };

  const handleImageSelection: ChangeEventHandlerUnion<HTMLInputElement, Event> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const buffer8Uint = new Uint8Array(buffer);

        const blob = new Blob([buffer8Uint], { type: file.type });
        const urlCreator = window.URL || window.webkitURL;

        const imageUrl = urlCreator.createObjectURL(blob);

        console.log(imageUrl);
      };
    }
  };

  return (
    <div class="flex-it py-1 px-4 flex-row">
      <Show when={props.showAvatar}>
        <div class="flex-it mr-4">
          <div class="w-12 h-12 overflow-visible cursor-pointer transition duration-200 hover:opacity-80">
            <img class="rounded-full" src={user?.avatar}></img>
          </div>
        </div>
      </Show>
      <div class="flex-it flex-grow">
        <div class="flex-it">
          <textarea
            value={form.content}
            onInput={(e) => {
              handleInput(e);
              autosize(e);
            }}
            name="content"
            rows="1"
            id="glide"
            class="bg-transparent resize-none overflow-hidden block !outline-none !border-none border-transparent focus:border-transparent focus:ring-0 text-gray-100 text-xl w-full p-0"
            placeholder={"What's new?"}
          />
        </div>
        <div class="flex-it mb-1 flex-row xs:justify-between items-center">
          <div class="flex-it mt-3 mr-3 cursor-pointer text-white hover:text-blue-400 transition">
            <div class="upload-btn-wrapper">
              <FaRegularImage class="cursor-pointer" size={18} />
              <input onChange={handleImageSelection} type="file" name="myfile" accept="image/*" />
            </div>
          </div>
          <div class="flex-it w-32 mt-3 cursor-pointer">
            <Button
              onClick={async () => {
                const glide = await handleSubmit();
                props.onGlideAdded(glide);
              }}
              disabled={sendDisabled()}
            >
              <span>Glide It</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
