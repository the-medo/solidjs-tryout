import { A } from '@solidjs/router';
import { Component } from 'solid-js';
import useForm from '../hooks/useForm';
import { RegisterForm } from '../types/Form';
import { requiredValidator } from '../utils/validators/requiredValidator';
import { minLengthValidator } from '../utils/validators/minLengthValidator';
import { firstUppercaseLetterValidator } from '../utils/validators/firstUppercaseLetterValidator';
import { FormError } from '../components/utils/FormError';
import { compareWithValidator } from '../utils/validators/compareWithValidator';
import useAuth from '../hooks/useAuth';

const RegisterScreen: Component = () => {
  const { authUser, loading } = useAuth('register');
  const { handleInput, submitForm, validate, errors } = useForm<RegisterForm>({
    fullName: '',
    nickName: '',
    email: '',
    avatar: '',
    password: '',
    passwordConfirmation: '',
  });

  const onFormSubmit = (form: RegisterForm) => {
    authUser(form);
    console.log(form);
    console.log('errors', errors);
  };

  return (
    <div class="flex-it justify-center items-center h-full">
      <div class="text-white text-4xl font-bold">Glider - Create Account</div>
      <div class="mt-10 flex-it h-100 xs:w-100 w-full bg-white p-10 rounded-2xl">
        <div class="flex-it">
          <form class="flex-it">
            <div class="flex-it overflow-hidden sm:rounded-md">
              <div class="flex-it">
                <div class="flex-it">
                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      onInput={handleInput}
                      use:validate={[
                        requiredValidator,
                        minLengthValidator,
                        firstUppercaseLetterValidator,
                      ]}
                      type="text"
                      name="fullName"
                      id="fullName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors['fullName']}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Nick Name</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator, (e) => minLengthValidator(e, 4)]}
                      type="text"
                      name="nickName"
                      id="nickName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors.nickName}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator]}
                      type="text"
                      name="email"
                      id="email"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors.email}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Avatar</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator]}
                      type="text"
                      name="avatar"
                      id="avatar"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors.avatar}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      onInput={handleInput}
                      use:validate={[requiredValidator]}
                      type="password"
                      name="password"
                      id="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />

                    <FormError>{errors.password}</FormError>
                  </div>

                  <div class="flex-it py-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Password Confirmation
                    </label>
                    <input
                      onInput={handleInput}
                      type="password"
                      name="passwordConfirmation"
                      id="passwordConfirmation"
                      use:validate={[
                        requiredValidator,
                        (ref) => compareWithValidator(ref, 'password'),
                      ]}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <FormError>{errors.passwordConfirmation}</FormError>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 pb-4">
                Already Registered?{' '}
                <A class="underline" href="/auth/login">
                  Go to Login
                </A>
              </div>
              <div class="flex-it py-2">
                <button
                  onClick={submitForm(onFormSubmit)}
                  disabled={loading()}
                  type="button"
                  class="
                  bg-blue-400 hover:bg-blue-500 focus:ring-0
                  disabled:cursor-not-allowed disabled:bg-gray-400
                  inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
