import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { CgCloseR } from "react-icons/cg";
import { register } from "../services/register"; // Importar con el mismo nombre

function RegisterModal({ isOpen, onClose, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const password = watch("password");

  const onValid = async (formData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Llamada REAL al backend - misma estructura que tu login
      const { data, error } = await register(
        formData.username,
        formData.email,
        formData.password
      );

      if (error) {
        // Manejar errores del backend
        if (
          error.message?.includes("already exists") ||
          error.message?.includes("ya existe")
        ) {
          setErrorMessage("El usuario o email ya está registrado");
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Error al registrar usuario");
        }
        return;
      }

      // Éxito - usuario creado
      setSuccessMessage("¡Usuario registrado exitosamente!");

      // Limpiar y cerrar después de éxito
      setTimeout(() => {
        reset();
        setSuccessMessage("");
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }, 2000);
    } catch (error) {
      // Manejar errores inesperados
      console.error("Error en registro:", error);
      setErrorMessage("Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage("");
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto pb-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Registrar Usuario
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-3xl"
            disabled={isLoading}
          >
            <CgCloseR />
          </button>
        </div>

        {/* Form */}
        <form
          className="p-6 space-y-4 flex flex-col gap-4"
          onSubmit={handleSubmit(onValid)}
        >
          <Input
            label="Usuario"
            {...registerForm("username", {
              required: "Usuario es obligatorio",
              minLength: {
                value: 3,
                message: "El usuario debe tener al menos 3 caracteres",
              },
            })}
            error={errors.username?.message}
            disabled={isLoading}
          />

          <Input
            label="Email"
            type="email"
            {...registerForm("email", {
              required: "Email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            error={errors.email?.message}
            disabled={isLoading}
          />

          <Input
            label="Contraseña"
            {...registerForm("password", {
              required: "Contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              validate: {
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) || "Debe contener al menos una mayúscula",

                hasLowercase: (value) =>
                  /[a-z]/.test(value) || "Debe contener al menos una minúscula",

                hasSpecialChar: (value) =>
                  /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/.test(value) ||
                  "Debe contener al menos un caracter especial",
              },
            })}
            type="password"
            error={errors.password?.message}
            disabled={isLoading}
          />

          <Input
            label="Confirmar Contraseña"
            {...registerForm("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
            type="password"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />

          {/* Mensajes */}
          {successMessage && (
            <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
