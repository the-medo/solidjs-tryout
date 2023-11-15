import { Validator } from '../../hooks/useForm';
import { niceName } from '../niceName';

export const firstUppercaseLetterValidator: Validator = (ref: HTMLInputElement) => () => {
  const value = ref.value;
  if (value.length === 0 || value[0].toUpperCase() === value[0]) return '';
  return `First letter of ${niceName(ref.name)} should be uppercase`;
};
