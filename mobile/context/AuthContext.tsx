import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userId: string | null;
  email: string | null;
  role: string | null;
  loading: boolean;
  login: (id: string, email: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------- RESTORE LOGIN -------- */

  useEffect(() => {
    const restore = async () => {
      const id = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      const role = await AsyncStorage.getItem('role');

      if (id && email && role) {
        setUserId(id);
        setEmail(email);
        setRole(role);
      }

      setLoading(false);
    };

    restore();
  }, []);

  /* -------- LOGIN -------- */

  const login = async (id: string, email: string, role: string) => {
    setUserId(id);
    setEmail(email);
    setRole(role);

    await AsyncStorage.setItem('userId', id);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('role', role);
  };

  /* -------- LOGOUT -------- */

  const logout = async () => {
    setUserId(null);
    setEmail(null);
    setRole(null);

    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        email,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
