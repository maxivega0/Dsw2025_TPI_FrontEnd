import { instance } from '../../shared/api/axiosInstance';

export const registerModal = async (username, email, password) => {
    const response = await instance.post('api/auth/register', { 
      username, 
      email, 
      password, 
      role: "Customer" 
    });

    return { data: response.data, error: null };
  } 
  
export const register = async (username, password, email, role) => {
  const response = await instance.post('api/auth/register', { username, password, email, role });

  return { data: response.data.token, error: null };
};