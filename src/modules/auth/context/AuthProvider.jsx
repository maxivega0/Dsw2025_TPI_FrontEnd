import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';
import { set } from 'react-hook-form';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
  };

  const singin = async (username, password) => {
    const { data, user, error } = await login(username, password);

    if (error) {
      return { error };
    }
    console.log(data);
    
    localStorage.setItem('token', data);
    localStorage.setItem('role', user.role);
    localStorage.setItem('username', user.username);
    setIsAuthenticated(true);
    setRole(user.role);
    setUsername(user.username);

    return { error: null };
  };

    const singup = async (username, password, email, role) => {
    const { data, error } = await register(username, password, email, role);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    setIsAuthenticated(true);
    setUsername(username);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        role,
        username,
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
