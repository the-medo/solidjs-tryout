import { niceName } from '../niceName';
import { Validator } from '../../hooks/useForm';

export const requiredValidator: Validator = (ref: HTMLInputElement) => () => {
  const value = ref.value;
  if (value.length > 0) return '';
  return `${niceName(ref.name)} is required`;
};
