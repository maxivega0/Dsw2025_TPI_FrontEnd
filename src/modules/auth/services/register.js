import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, password, email, role) => {
  const response = await instance.post('api/auth/register', { username, password, email, role });

  return { data: response.data.token, error: null };
};