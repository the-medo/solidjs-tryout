import { createStore } from 'solid-js/store';
import { GInputEvent, MessengerForm } from '../types/Form';

const useMessenger = () => {
  const [form, setForm] = createStore<MessengerForm>({
    content: '',
  });

  const handleInput = (e: GInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name, value);
  };

  const handleSubmit = () => {
    const glide = {
      ...form,
    };

    setForm({
      content: '',
    });
  };

  return {
    handleInput,
    handleSubmit,
    form,
  };
};

export default useMessenger;