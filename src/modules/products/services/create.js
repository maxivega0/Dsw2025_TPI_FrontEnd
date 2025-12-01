import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  await instance.post('/api/products', {
    Sku: formData.sku,
    InternalCode: formData.cui,
    Name: formData.name,
    Description: formData.description,
    CurrentUnitPrice: formData.price,
    Image: formData.image,
    StockQuantity: formData.stock,
  });
};