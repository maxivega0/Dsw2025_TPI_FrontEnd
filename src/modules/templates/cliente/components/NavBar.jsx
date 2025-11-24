import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hook/useAuth";
import Button from "../../../shared/components/Button";
import { RiAppsLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import ClientNav from "../../../shared/components/ClientNav";
import LoginModal from "../../../auth/components/LoginModal";


function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para el modal

  const navigate = useNavigate();
  const { singout, isAuthenticated } = useAuth(); // Agregar isAuthenticated

  const logout = () => {
    singout();
    navigate("/login");
  };

  const handleLoginSuccess = () => {
    // Cerrar menú móvil si está abierto
    setOpenMenu(false);
    // Puedes mostrar un mensaje de éxito o redirigir
    console.log("Login exitoso desde navbar");
  };

  const renderAuthButtons = (mobile = false) => {
    if (isAuthenticated) {
      // Usuario autenticado - mostrar cerrar sesión
      return (
        <Button
          className={`${mobile ? "block w-full" : ""}`}
          onClick={logout}
          variant="secondary"
        >
          Cerrar sesión
        </Button>
      );
    } else {
      // Usuario no autenticado - mostrar login/registro
      return (
        <div className={`flex ${mobile ? "flex-col gap-2" : "gap-2"}`}>
          <Button
            onClick={() => {
              setIsLoginModalOpen(true);
              if (mobile) setOpenMenu(false);
            }}
            className={mobile ? "w-full" : ""}
          >
            Iniciar Sesión
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate("/register");
              if (mobile) setOpenMenu(false);
            }}
            className={mobile ? "w-full" : ""}
          >
            Registrarse
          </Button>
        </div>
      );
    }
  };

  // Estilos condicionales para el menú lateral
  const mobileMenuStyles = `
    fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
    transform transition-transform duration-300 ease-in-out
    p-4 flex flex-col gap-4
    ${openMenu ? "translate-x-0" : "translate-x-full"}
  `;

  // Estilos condicionales para el overlay del menú
  const overlayStyles = `
    fixed inset-0 z-40 backdrop-blur-sm
    transition-opacity duration-300
    ${openMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
  `;

  return (
    <div className="h-full">
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      <div className={overlayStyles} onClick={() => setOpenMenu(false)} />

      <header
        className="
        grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto_1fr_auto]
        items-center
        p-4
        shadow
        rounded
        bg-white
        gap-4
        sm:col-span-3
      "
      >
        {/* Logo/Icono - visible en mobile y desktop */}
        <div className="col-span-1 flex items-center">
          <RiAppsLine className="text-xl" />
        </div>

        {/* Navegación - solo visible en desktop */}
        <nav
          className="
          hidden md:flex md:col-span-1
          gap-4
          justify-end
        "
        >
          {/* ClientNav para desktop - contenedor horizontal */}
          <div className="flex gap-4">
            <ClientNav setOpenMenu={setOpenMenu} setMobileView={() => {}} />
          </div>
        </nav>

        {/* Search Bar*/}
        <div
          className="
          col-span-1 md:col-span-1
          flex
          items-center
          gap-2
          border-gray-300
          border
          rounded-lg
          px-3
          py-1
          shadow-md
          min-w-0
        "
        >
          <input
            type="text"
            placeholder="Buscar"
            className="border-none w-full outline-none"
          />
          <IoSearchOutline />
        </div>

        {/* Botón Hamburguesa*/}
        <button
          className="
            col-span-1 md:hidden
            bg-transparent
            border-none
            shadow-none
            flex justify-end
          "
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? (
            <span className="text-2xl">&#215;</span>
          ) : (
            <span className="text-2xl">&#9776;</span>
          )}
        </button>

        {/* Botones de auth - DESKTOP */}
        <div className="hidden md:flex md:col-span-1 gap-2 justify-end">
          {renderAuthButtons(false)}
        </div>
      </header>

      {/* Menú lateral móvil */}
      <div className={mobileMenuStyles}>
        {/* Navegación móvil */}
        <nav className="flex-1">
          {/* ClientNav para mobile - contenedor vertical */}
          <ClientNav setOpenMenu={setOpenMenu} setMobileView={() => {}} />
        </nav>

        {/* Botones de auth - MOBILE */}
        <div className="flex flex-col gap-2 mt-4">
          {renderAuthButtons(true)}
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <main
        className="
        p-5
        overflow-y-scroll
        col-span-3
      "
      >
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;