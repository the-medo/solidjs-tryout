import { Snackbar } from './index';
import { useUIDispatch, useUIState } from '../../context/ui';
import { For } from 'solid-js';

export default function SnackbarContainer() {
  const { snackbars } = useUIState();
  const { removeSnackbar } = useUIDispatch();
  return (
    <div class="fixed z-50 top-0 right-0 p-4 w-ful md:max-w-xs">
      <ul class="flex flex-col space-y-2">
        <For each={snackbars}>
          {(sb) => <Snackbar message={sb.message} type={sb.type} onClose={removeSnackbar(sb.id)} />}
        </For>
      </ul>
    </div>
  );
}
