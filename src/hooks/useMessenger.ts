import { createStore } from 'solid-js/store';
import { GInputEvent, MessengerForm, UploadImage } from '../types/Form';
import { useAuthState } from '../context/auth';
import { useUIDispatch } from '../context/ui';
import { createSignal } from 'solid-js';
import { createGlide, uploadImage } from '../api/glide';
import { FirebaseError } from 'firebase/app';

const defaultImage = () => ({
  buffer: new ArrayBuffer(0),
  name: '',
  previewUrl: '',
});

const useMessenger = (answerTo?: string) => {
  const { isAuthenticated, user } = useAuthState()!;
  const { addSnackbar } = useUIDispatch();
  const [image, setImage] = createSignal<UploadImage>(defaultImage());
  const [loading, setLoading] = createSignal(false);
  const [form, setForm] = createStore<MessengerForm>({
    content: '',
  });

  const handleInput = (e: GInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name, value);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      addSnackbar({
        message: 'You are not authenticated',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    const glide = {
      ...form,
      uid: user.uid,
    };

    try {
      if (image().buffer.byteLength > 0) {
        const downloadUrl = await uploadImage(image());
      }

      const newGlide = await createGlide(glide, answerTo);
      newGlide.user = user;

      addSnackbar({ message: 'Glide added', type: 'success' });
      setForm({
        content: '',
      });
      return newGlide;
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleInput,
    handleSubmit,
    form,
    loading,
    image,
    setImage,
  };
};

export default useMessenger;
