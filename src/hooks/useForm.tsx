import {
  Accessor,
  Component,
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  ParentComponent,
  Show,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Form, FormErrors, GInputEvent, RegisterForm, SubmitCallback } from '../types/Form';

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

export const FormError: ParentComponent = ({ children }) => {
  const errors = () => ((children as string[]) ?? []).filter((error) => error.length > 0);

  return (
    <Show when={errors().length > 0}>
      <div class="flex-it grow text-xs bg-red-400 text-white p-3 pl-3 mt-1 rounded-md">
        <For each={errors()}>{(message) => <div>{message}</div>}</For>
      </div>
    </Show>
  );
};

const useForm = <T extends Form>(initialForm: T) => {
  const [form, setForm] = createStore<T>(initialForm);
  const [errors, setErrors] = createStore<FormErrors>();

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
    setErrors(ref.name, []);

    validators.forEach((validator) => {
      setErrors(
        produce((errors) => {
          errors[ref.name]?.push(validator(ref));
        }),
      );
    });

    console.log(errors[ref.name]);
  };

  return {
    form,
    handleInput,
    submitForm,
    validate,
    errors,
  };
};

export default useForm;
