import { Validator } from '../../hooks/useForm';
import { Form } from '../../types/Form';
import { niceName } from '../niceName';

export const compareWithValidator: Validator =
  (ref: HTMLInputElement, fieldName: string) => (form: Form) => {
    if (ref.value.length === 0) return '';

    const compareToValue = form[fieldName];
    return ref.value === compareToValue
      ? ''
      : `${niceName(ref.name)} should be equal to ${fieldName}`;
  };
