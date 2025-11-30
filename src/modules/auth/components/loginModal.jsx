import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import useAuth from "../hook/useAuth";
import { CgCloseR } from "react-icons/cg";

function LoginModal({ isOpen, onClose, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { username: "", password: "" } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await singin(formData.username, formData.password);

      reset();
      setErrorMessage("");

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/admin/home");
      }

      onClose();
    } catch (error) {

      if (error?.response?.data?.error) {
        setErrorMessage([error?.response?.data?.error]);
      } else {
        setErrorMessage("Error al iniciar sesión. Intente nuevamente.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto pb-5">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Iniciar Sesión
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-3xl"
            disabled={isLoading}
          >
            <CgCloseR />
          </button>
        </div>

        <form
          className="p-6 space-y-4 flex flex-col gap-7 md:gap-0"
          onSubmit={handleSubmit(onValid)}
        >
          <Input
            label="Usuario"
            {...register("username", {
              required: "Usuario es obligatorio",
            })}
            error={errors.username?.message}
            disabled={isLoading}
          />
          <Input
            label="Contraseña"
            {...register("password", {
              required: "Contraseña es obligatoria",
            })}
            type="password"
            error={errors.password?.message}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-3 pt-12">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </Button>
          </div>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center md:m-0">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
