import { Glide } from '../types/Glide';
import { createStore, produce } from 'solid-js/store';
import { createSignal, onMount } from 'solid-js';
import { getGlides } from '../api/glide';
import { FirebaseError } from 'firebase/app';
import { useUIDispatch } from '../context/ui';

type State = {
  pages: Record<
    number,
    {
      glides: Glide[];
    }
  >;
  loading: boolean;
};

const createInitState = (): State => ({
  pages: {
    1: { glides: [] },
  },
  loading: false,
});

const useGlides = () => {
  const [page, setPage] = createSignal(1);
  const [store, setStore] = createStore(createInitState());
  const { addSnackbar } = useUIDispatch();

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    const _page = page();

    setStore('loading', true);
    try {
      const { glides } = await getGlides();
      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          }),
        );
      }
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setStore('loading', false);
    }
  };

  const addGlide = (glide: Glide | undefined) => {
    if (!glide) return;

    const page = 1;
    setStore(
      produce((store) => {
        store.pages[page].glides.unshift({ ...glide });
      }),
    );
  };

  return {
    page,
    loadGlides,
    addGlide,
    store,
  };
};

export default useGlides;
