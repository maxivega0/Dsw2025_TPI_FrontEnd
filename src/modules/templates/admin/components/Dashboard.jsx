import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../auth/hook/useAuth';
import Button from '../../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { singout } = useAuth();

  const showMenu = () => setOpenMenu(true);
  const hideMenu = () => setOpenMenu(false);

  const logout = () => {
    singout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  const renderLogoutButton = (mobile = false) => (
    <Button className={`${mobile ? 'block w-full sm:hidden' :  'hidden sm:block' }`} onClick={logout}>Cerrar sesión</Button>
  );

  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        sm:gap-3
        sm:grid-cols-[256px_1fr]
        relative
      "
    >
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10 sm:hidden"
          onClick={hideMenu}
        />
      )}
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow
          rounded
          bg-white
          sm:col-span-2
          relative
          z-20
        "
      >
        <span>Mi Dashboard</span>
        {renderLogoutButton()}
        <button
          className="
            bg-transparent
            border-none
            shadow-none
            sm:hidden
          "
          onClick={() => (openMenu ? hideMenu() : showMenu())}
        >{ openMenu ? <span>&#215;</span> : <span>&#9776;</span>}</button>
      </header>
      <aside
        className={`
          absolute
          top-0
          bottom-0
          bg-white
          w-64
          p-6
          ${openMenu ? 'left-0' : 'left-[-256px]'}
          rounded
          shadow
          flex
          flex-col
          justify-between
          transition-all
          duration-300
          z-20
          sm:relative
          sm:left-0
          sm:z-auto
        `}
        style={{ pointerEvents: openMenu || window.innerWidth >= 640 ? 'auto' : 'none' }}
      >
        <nav>
          <ul
            className='flex flex-col'
          >
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Ordenes</NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderLogoutButton(true)}
      </aside>
      <main
        className="
          p-5
          overflow-y-scroll
          relative
          z-0
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
