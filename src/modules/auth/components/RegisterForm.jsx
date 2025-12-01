import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '', confirmPassword: '', email: '', role: 'Customer' } });

  const navigate = useNavigate();

  const { singup } = useAuth();

  const onValid = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {

      await singup(formData.username, formData.password, formData.email, formData.role);

      reset();
      setErrorMessage("");

      if (formData.role == "Customer") {
        navigate('/');
      }
      else {
        navigate('/admin/home');
      }

    } catch (error) {
      if (error?.response?.data?.error) {
        setErrorMessage([error?.response?.data?.error]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:p-6
        sm:w-md 
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
          minLength: {
            value: 3,
            message: "El usuario debe tener al menos 3 caracteres",
          },
        })}
        error={errors.username?.message}
        disabled={isLoading}
      />
      <Input label='Email'
        {...register('email', {
          required: 'Email es obligatorio',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'El email no tiene un formato válido' },
        })}
        type='email'
        error={errors.email?.message}
        disabled={isLoading}
      />
      <Input
        label='Contraseña'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          validate: {
            hasUpperCase: (v) => /[A-Z]/.test(v) || 'La contraseña debe contener al menos una letra mayúscula',
            hasLowerCase: (v) => /[a-z]/.test(v) || 'La contraseña debe contener al menos una letra minúscula',
            hasDigit: (v) => /\d/.test(v) || 'La contraseña debe contener al menos un número',
            hasSpecialChar: (v) => /[^A-Za-z0-9]/.test(v) || 'La contraseña debe contener al menos un caracter especial',
          },
        })}
        type='password'
        error={errors.password?.message}
        disabled={isLoading}
      />
      <Input
        label='Confirmar Contraseña'
        {...register('confirmPassword', {
          required: 'Confirmar Contraseña es obligatoria',
          validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
        })}
        type='password'
        error={errors.confirmPassword?.message}
        disabled={isLoading}
      />
      <Select label="Rol"
        {...register('role', {
          required: 'Rol es obligatorio',
        })}
        disabled={isLoading}
      >
        <option value="Admin">Admin</option>
        <option value="Customer">Customer</option>
      </Select>

      <Button type='submit'>{isLoading ? "Registrando Usuario..." : "Registrar Usuario"}</Button>
      <Button variant='secondary' onClick={() => navigate("/login")}>Iniciar Sesion</Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default RegisterForm;
