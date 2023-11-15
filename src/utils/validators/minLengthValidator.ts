import { Validator } from '../../hooks/useForm';
import { niceName } from '../niceName';

export const minLengthValidator: Validator =
  (ref: HTMLInputElement, minLength = 7) =>
  () => {
    const value = ref.value;
    if (value.length === 0 || value.length >= minLength) return '';
    return `${niceName(ref.name)} should be greater or equal than ${minLength} characters`;
  };
