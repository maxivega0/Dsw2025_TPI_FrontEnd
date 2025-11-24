import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hook/useAuth";
import Button from "../../../shared/components/Button";
import { RiAppsLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import ClientNav from "../../../shared/components/ClientNav";

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { singout } = useAuth();

  const logout = () => {
    singout();
    navigate("/login");
  };

  const renderLogoutButton = (mobile = false) => (
    <Button
      className={`${mobile ? "block w-full sm:hidden" : "hidden sm:block"}`}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );

  // Estilos condicionales para el menú lateral
  const mobileMenuStyles = `
    fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
    transform transition-transform duration-300 ease-in-out
    p-4 flex flex-col gap-4
    ${openMenu ? "translate-x-0" : "translate-x-full"}
  `;

  // Estilos condicionales para el overlay del menú
  const overlayStyles = `
    fixed inset-0 bg-gray-500 bg-opacity-50 z-40
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

        {/* Botones de auth*/}
        <div className="hidden md:flex md:col-span-1 gap-2 justify-end">
          <button className="bg-purple-300 p-2 rounded-lg hover:bg-purple-400 transition">
            Iniciar Sesión
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            Registrarse
          </button>
        </div>
      </header>

      {/* Menú lateral móvil */}
      <div className={mobileMenuStyles}>
        {/* Navegación móvil */}
        <nav className="flex-1">
          {/* ClientNav para mobile - contenedor vertical */}
          <ClientNav setOpenMenu={setOpenMenu} setMobileView={() => {}} />
        </nav>

        {/* Botones de auth*/}
        <div className="flex flex-col gap-2 mt-4">
          <button className="bg-purple-300 p-2 rounded-lg hover:bg-purple-400 transition w-full">
            Iniciar Sesión
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition w-full">
            Registrarse
          </button>
        </div>

        {/*Cerrar sesión*/}
        {renderLogoutButton(true)}
      </div>

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
