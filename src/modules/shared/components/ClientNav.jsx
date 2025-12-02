import { NavLink } from 'react-router-dom';
import { useCartActions } from '../../cart/hook/useCartActions';

function ClientNav({ setOpenMenu, setMobileView }) {
  const { getCartItemCount } = useCartActions();

  const getLinkStyles = ({ isActive }) =>
    `
      w-full block p-2 rounded-xl transition hover:bg-gray-100
      ${isActive ? 'bg-gray-200 hover:bg-purple-100 ' : ''}
    `;

  return (
    <ul className="flex flex-col md:flex-row gap-2">
      <li>
        <NavLink
          to="/"
          className={getLinkStyles}
          onClick={() => {
            setOpenMenu(false), setMobileView(false);
          }}
        >
          Productos
        </NavLink>
      </li>
      <li className="relative">
        <NavLink
          to="/cart"
          className={getLinkStyles}
          onClick={() => {
            setOpenMenu(false), setMobileView(false);
          }}
        >
          <p className="px-1">Carrito de Compras</p>
          {getCartItemCount() > 0 && (
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </NavLink>
      </li>
    </ul>
  );
}

export default ClientNav;
