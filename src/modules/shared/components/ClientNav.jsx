import { NavLink } from "react-router-dom";
function ClientNav() {
    const getLinkStyles = ({ isActive }) =>
    `
      w-full block p-2 rounded-xl transition hover:bg-gray-100
      ${isActive ? "bg-gray-200 hover:bg-purple-100 " : ""}
    `;
    return (
        <ul className="flex flex-col md:flex-row gap-2">
              <li>
                <NavLink
                  to="/"
                  className={getLinkStyles}
                  onClick={() => {setOpenMenu(false), setMobileView(false)}}
                >
                  Productos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={getLinkStyles}
                  onClick={() => {setOpenMenu(false), setMobileView(false)}}
                >
                  Carrito de Compras
                </NavLink>
              </li>
            </ul>
    );
} export default ClientNav;