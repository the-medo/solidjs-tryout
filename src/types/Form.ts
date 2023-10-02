export type GInputEvent = InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export type RegisterForm = {
  fullName: string;
  nickName: string;
  email: string;
  avatar: string;
  password: string;
  passwordConfirmation: string;
};
