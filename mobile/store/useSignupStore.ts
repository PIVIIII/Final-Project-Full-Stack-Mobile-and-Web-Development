import { create } from 'zustand';

type FormData = {
  email: string;
  password: string;
  username: string;

  phone: string;
  linkType: 'additional' | 'other';
  link?: string;
  address: string;

  role: 'buyer' | 'seller';
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
    linkType: 'other',
    link: '',
    address: '',
    role: 'buyer',
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
        linkType: 'other',
        link: '',
        address: '',
        role: 'buyer',
      },
    }),
}));
