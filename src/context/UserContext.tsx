import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'Administrator',
    department: 'Academic Registry'
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login functionality
    if (email === 'admin@university.edu' && password === 'password') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@university.edu',
        role: 'Administrator',
        department: 'Academic Registry'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}