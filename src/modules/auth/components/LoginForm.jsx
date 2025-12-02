import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  const onValid = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await singin(formData.username, formData.password);
      navigate('/admin/home');
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
    <form
      className="
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      "
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
        disabled={isLoading}
      />
      <Input
        label="Contraseña"
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type="password"
        error={errors.password?.message}
        disabled={isLoading}
      />

      <Button type="submit">
        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>
      <Button variant="secondary" onClick={() => navigate('/register')}>
        Registrar Usuario
      </Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;
