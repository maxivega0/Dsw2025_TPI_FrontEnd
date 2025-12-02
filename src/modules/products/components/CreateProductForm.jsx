import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';

function CreateProductForm() {
  const {
    register,
    setError,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      // Ensure SKU is uppercase to comply with the required format (e.g. GHI789)
      if (payload.sku) payload.sku = String(payload.sku).toUpperCase();

      await createProduct(payload);

      navigate('/admin/products');
    } catch (error) {
      setErrorBackendMessage([error.response?.data?.error || 'Error al procesar la orden']);
    }
  };

  return (
    <Card>
      <form
        className='
          flex
          flex-col
          gap-25
          p-8
          sm:gap-0
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
            pattern: { value: /^[A-Z]{3}\d{3}$/, message: "Formato SKU inválido. Ej: 'GHI789'" },
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
            minLength: { value: 3, message: 'El código debe tener al menos 3 caracteres' },
            maxLength: { value: 50, message: 'El código supera el límite de 50 caracteres' },
            pattern: { value: /^[A-Za-z0-9\-]+$/i, message: 'El código debe ser alfanumérico' },
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            maxLength: { value: 200, message: 'El nombre supera el límite de 200 caracteres' },
          })}
        />
        <Input
          label='Descripción'
          error={errors.description?.message}
          {...register('description', {
            maxLength: { value: 1000, message: 'La descripción supera el límite de 1000 caracteres' },
          })}
        />
        <Input
          label='Imagen URL'
          error={errors.image?.message}
          {...register('image', {
            pattern: { value: /^(https?:\/\/.+\.(jpg|jpeg|png|gif|svg))$/i, message: 'La URL de la imagen es inválida o extensión no soportada' },
          })}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          step='0.01'
          {...register('price', {
            valueAsNumber: true,
            required: 'Precio es requerido',
            min: {
              value: 0.01,
              message: 'El precio debe ser mayor a 0',
            },
            validate: {
              positive: (v) => v >= 0.01 || 'El precio no puede ser negativo',
            },
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          {...register('stock', {
            valueAsNumber: true,
            required: 'Stock es requerido',
            min: {
              value: 0,
              message: 'El stock no puede ser negativo',
            },
            validate: {
              integer: (v) => Number.isInteger(v) || 'El stock debe ser un número entero',
            },
          })}
        />
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit' disabled={isSubmitting}>Crear Producto</Button>
        </div>
        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
