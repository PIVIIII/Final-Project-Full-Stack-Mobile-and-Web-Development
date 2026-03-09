import { createContext, useContext, useState } from 'react';

type User = {
  id: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  login: (id: string, email: string, role?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string, email: string, role?: string) => {
    setUser({ id, email, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
