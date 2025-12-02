import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  const params = {};

  if (search) params.search = search;

  if (status) params.status = status;

  params.pageNumber = pageNumber;
  params.pageSize = pageSize;

  const queryString = new URLSearchParams(params);

  try {
    const response = await instance.get(`api/products/admin?${queryString}`);

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
