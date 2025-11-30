import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, user, error } = await login(username, password);
    if (error) {
      return { error };
    }    

    console.log(data, user);

    localStorage.setItem('token', data);
    localStorage.setItem('role', user.role);
    setIsAuthenticated(true);
    setRole(user.role);

    return { error: null };
  };

    const singup = async (username, password, email, role) => {
    const { data, error } = await register(username, password, email, role);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        singin,
        singout,
        singup,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};