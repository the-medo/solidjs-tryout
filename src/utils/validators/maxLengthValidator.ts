import { Validator } from '../../hooks/useForm';
import { niceName } from '../niceName';

export const maxLengthValidator: Validator =
  (ref: HTMLInputElement, maxLength = 7) =>
  () => {
    const value = ref.value;
    if (value.length === 0 || value.length < maxLength) return '';
    return `${niceName(ref.name)} should be less than ${maxLength} characters`;
  };
