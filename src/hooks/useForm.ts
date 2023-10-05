import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Form, GInputEvent, RegisterForm, SubmitCallback } from '../types/Form';

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore<T>(initialForm);

  const handleInput = (e: GInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name as any, value as any);
  };

  const submitForm = (submitCallback: SubmitCallback<T>) => () => {
    console.log(form);
  };

  return {
    form,
    handleInput,
    submitForm,
  };
};

export default useForm;
