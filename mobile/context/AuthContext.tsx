import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  email: string | null;
  role: string | null;
  login: (id: string, email: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const login = (id: string, email: string, role: string) => {
    setUserId(id);
    setEmail(email);
    setRole(role);
  };

  const logout = () => {
    setUserId(null);
    setEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ userId, email, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
