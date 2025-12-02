import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, password, role = 'Customer') => {
  const response = await instance.post('api/auth/register', { username, password, email, role });

  return { data: response.data.token, user: response.data.user, error: null };
};