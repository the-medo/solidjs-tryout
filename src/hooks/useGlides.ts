import { Glide } from '../types/Glide';
import { createStore } from 'solid-js/store';
import { onMount } from 'solid-js';
import { getGlides } from '../api/glide';
import { FirebaseError } from 'firebase/app';
import { useUIDispatch } from '../context/ui';

type State = {
  glides: Glide[];
  loading: boolean;
};

const createInitState = (): State => ({
  glides: [],
  loading: false,
});

const useGlides = () => {
  const [store, setStore] = createStore(createInitState());
  const { addSnackbar } = useUIDispatch();

  onMount(() => {
    loadGlides();
  });

  const loadGlides = async () => {
    setStore('loading', true);
    try {
      const { glides } = await getGlides();
      setStore('glides', glides);
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setStore('loading', false);
    }
  };

  return {
    loadGlides,
    store,
  };
};

export default useGlides;
