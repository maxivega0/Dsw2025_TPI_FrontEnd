import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, password) => {
  try {
    const response = await instance.post('api/auth/register', { 
      username, 
      email, 
      password, 
      role: "Customer" 
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data || { message: 'Error de conexión' } 
    };
  }
export const register = async (username, password, email, role) => {
  const response = await instance.post('api/auth/register', { username, password, email, role });

  return { data: response.data.token, error: null };
};