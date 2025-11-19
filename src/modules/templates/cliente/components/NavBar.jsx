import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hook/useAuth";
import Button from "../../../shared/components/Button";
import { RiAppsLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { singout } = useAuth();

  const logout = () => {
    singout();
    navigate("/login");
  };

  const getLinkStyles = ({ isActive }) =>
    `
      w-full block  p-2 rounded-xl transition hover:bg-gray-100
      ${isActive ? "bg-gray-200 hover:bg-purple-100 " : ""}
    `;
  const renderLogoutButton = (mobile = false) => (
    <Button
      className={`${mobile ? "block w-full sm:hidden" : "hidden sm:block"}`}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );

  return (
    <div
      className="
        h-full
      "
    >
      <header
        className="
          grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto_auto_auto_auto]
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
          <ul className="flex gap-4">
            <li>
              <NavLink to="/admin/products" className={getLinkStyles}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={getLinkStyles}>
                Carrito de Compras
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Search Bar - visible en mobile y desktop */}
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

        {/* Botón Hamburguesa - solo visible en mobile */}
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

        {/* Botones de auth - solo visible en desktop */}
        <div className="hidden md:flex md:col-span-1 gap-2 justify-end">
          <button className="bg-purple-300 p-2 rounded-lg hover:bg-purple-400 transition">
            Iniciar Sesión
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            Registrarse
          </button>
        </div>
      </header>

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
