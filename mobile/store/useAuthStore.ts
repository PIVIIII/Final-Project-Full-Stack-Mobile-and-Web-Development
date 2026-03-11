import { create } from 'zustand';

type User = {
  _id: string;
  email: string;
  username: string;
  role: 'buyer' | 'seller';
};

type Store = {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<Store>((set) => ({
  user: null,
  token: null,

  login: (user, token) =>
    set({
      user,
      token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
