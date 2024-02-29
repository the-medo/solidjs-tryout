import { Glide } from '../types/Glide';
import { createStore, produce } from 'solid-js/store';
import { createSignal, onMount } from 'solid-js';
import * as api from '../api/glide';
import { FirebaseError } from 'firebase/app';
import { useUIDispatch } from '../context/ui';
import { QueryDocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import { useAuthState } from '../context/auth';

type State = {
  pages: Record<
    number,
    {
      glides: Glide[];
    }
  >;
  loading: boolean;
  lastGlide: QueryDocumentSnapshot | null;
  newGlides: Glide[];
};

const createInitState = (): State => ({
  pages: {
    1: { glides: [] },
  },
  loading: false,
  lastGlide: null,
  newGlides: [],
});

const useGlides = () => {
  const { user } = useAuthState()!;
  const [page, setPage] = createSignal(1);
  const [store, setStore] = createStore(createInitState());
  const { addSnackbar } = useUIDispatch();

  let unSubscribe: Unsubscribe;

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    const _page = page();

    if (_page > 1 && !store.lastGlide) {
      return;
    }

    setStore('loading', true);
    try {
      const { glides, lastGlide } = await api.getGlides(user!, store.lastGlide);
      if (glides.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { glides };
          }),
        );

        setPage(_page + 1);
      }

      setStore('lastGlide', lastGlide);
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setStore('loading', false);
    }
  };

  const subscribeToGlides = () => {
    if (!user) return;

    unSubscribe = api.subscribeToGlides(user!, (newGlides: Glide[]) => {
      setStore('newGlides', newGlides);
    });
  };

  const unsubscribeFromGlides = () => {
    if (!!unSubscribe) {
      unSubscribe();
    }
  };

  const resubscribe = () => {
    unsubscribeFromGlides();
    subscribeToGlides();
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

  const displayNewGlides = () => {
    store.newGlides.forEach((newGlide) => {
      addGlide(newGlide);
    });

    setStore('newGlides', []);
    resubscribe();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    page,
    loadGlides,
    addGlide,
    store,
    subscribeToGlides,
    unsubscribeFromGlides,
    displayNewGlides,
  };
};

export default useGlides;
