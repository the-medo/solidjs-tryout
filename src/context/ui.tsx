import { createContext, createUniqueId, ParentComponent, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export type SnackbarMessage = {
  message: string;
  type: 'success' | 'error' | 'warning';
  id: string;
};

type UIStateContextValues = {
  snackbars: SnackbarMessage[];
};

type UIDispatchContextValues = {
  addSnackbar: (s: Omit<SnackbarMessage, 'id'>) => void;
  removeSnackbar: (id: string) => () => void;
};

const UIStateContext = createContext<UIStateContextValues>();
const UIDispatchContext = createContext<UIDispatchContextValues>();

const initialState = (): UIStateContextValues => ({
  snackbars: [],
});

const UIProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<UIStateContextValues>(initialState());

  const addSnackbar = (snackbar: Omit<SnackbarMessage, 'id'>) => {
    setStore(
      'snackbars',
      produce((snackbars) => {
        snackbars.push({ ...snackbar, id: createUniqueId() });
      }),
    );
  };

  const removeSnackbar = (id: string) => () => {
    setStore(
      'snackbars',
      produce((snackbars) => {
        const index = snackbars.findIndex((sb) => sb.id === id);
        if (index > -1) {
          snackbars.splice(index, 1);
        }
      }),
    );
  };

  return (
    <UIStateContext.Provider value={store}>
      <UIDispatchContext.Provider value={{ addSnackbar, removeSnackbar }}>
        {props.children}
      </UIDispatchContext.Provider>
    </UIStateContext.Provider>
  );
};

export const useUIState = () => useContext(UIStateContext)!;
export const useUIDispatch = () => useContext(UIDispatchContext)!;

export default UIProvider;
