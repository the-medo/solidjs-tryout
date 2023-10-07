import { Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Form, GInputEvent, RegisterForm, SubmitCallback } from '../types/Form';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      validate: Validator[];
    }
  }
}

type Validator = (element: HTMLInputElement, ...rest: any[]) => string;

export const maxLengthValidator: Validator = (ref: HTMLInputElement, maxLength = 7): string => {
  const value = ref.value;
  if (value.length === 0 || value.length < maxLength) return '';
  return `${ref.name} should be less than ${maxLength} characters`;
};

export const firstUppercaseLetterValidator: Validator = (ref: HTMLInputElement): string => {
  const value = ref.value;
  if (value.length === 0 || value[0].toUpperCase() === value[0]) return '';
  return `First letter of ${ref.name} should be uppercase`;
};

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore<T>(initialForm);
  const [errors, setErrors] = createStore<Form>({});

  const handleInput = (e: GInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name as any, value as any);
  };

  const submitForm = (submitCallback: SubmitCallback<T>) => () => {
    console.log(form);
  };

  const validate = (ref: HTMLInputElement, accessor: Accessor<Validator[]>) => {
    const validators = accessor() || [];

    ref.onblur = checkValidity(ref, validators);

    ref.oninput = () => {};
  };

  const checkValidity = (ref: HTMLInputElement, validators: Validator[]) => () => {
    validators.forEach((validator) => {
      setErrors(ref.name, validator(ref));
    });
  };

  return {
    form,
    handleInput,
    submitForm,
    validate,
  };
};

export default useForm;
