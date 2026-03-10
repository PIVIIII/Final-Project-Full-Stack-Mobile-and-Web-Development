import { create } from 'zustand';

type FavoriteStore = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],

  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),
}));
