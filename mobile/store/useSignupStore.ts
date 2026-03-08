import { create } from 'zustand';

type FormData = {
  email: string;
  password: string;
  username: string;
  phone: string;
  link?: string;
  address: string;
};

type Store = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
};

export const useSignupStore = create<Store>((set) => ({
  formData: {
    email: '',
    password: '',
    username: '',
    phone: '',
    link: '',
    address: '',
  },

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        email: '',
        password: '',
        username: '',
        phone: '',
        link: '',
        address: '',
      },
    }),
}));
