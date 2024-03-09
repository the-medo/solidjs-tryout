import { Glide, GlidePage, UseGlideState } from '../types/Glide';
import { createStore, produce } from 'solid-js/store';
import * as api from '../api/glide';
import { FirebaseError } from 'firebase/app';
import { createSignal } from 'solid-js';
import { useUIDispatch } from '../context/ui';
import { useAuthState } from '../context/auth';

const defaultState = () => ({
  pages: {},
  lastGlide: null,
  loading: false,
});

const useSubglides = () => {
  const { user } = useAuthState()!;
  const [store, setStore] = createStore<UseGlideState>(defaultState());
  const [page, setPage] = createSignal(1);
  const { addSnackbar } = useUIDispatch();

  const loadGlides = async (glideLookup: string) => {
    const _page = page();

    if (_page > 1 && !store.lastGlide) {
      return;
    }

    setStore('loading', true);
    try {
      const { glides, lastGlide } = await api.getSubglides(glideLookup, store.lastGlide);
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

  const addGlide = (glide: Glide | undefined) => {
    if (!glide) return;

    const page = 1;
    setStore(
      produce((store) => {
        store.pages[page].glides.unshift({ ...glide });
      }),
    );
  };

  const resetPagination = () => {
    setStore(
      produce((store) => {
        for (let i = 1; i <= page(); i++) {
          store.pages[i] = { glides: [] };
        }

        store.lastGlide = null;
      }),
    );

    setPage(1);
  };

  return { store, loadGlides, page, addGlide, resetPagination };
};

export default useSubglides;
