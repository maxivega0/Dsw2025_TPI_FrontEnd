import { useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../../auth/hook/useAuth";
import Button from "../../../shared/components/Button";
import { RiAppsLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import ClientNav from "../../../shared/components/ClientNav";
import LoginModal from "../../../auth/components/LoginModal";
import RegisterModal from "../../../auth/components/RegisterModal";
import { useCartActions } from "../../../cart/hook/useCartActions";

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const navigate = useNavigate();
  const { singout, isAuthenticated } = useAuth();
  const { clearCart } = useCartActions();

  const logout = () => {
    clearCart(); 
    singout();
    navigate("/");
  };

  const handleLoginSuccess = () => {
    setOpenMenu(false);
    console.log("Login exitoso desde navbar");
    navigate("/admin/home");
  };

  const handleRegisterSuccess = () => {
    setOpenMenu(false)
    console.log("Registro exitoso desde navbar")
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching
    params.delete("pageNumber");
    setSearchParams(params);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const renderAuthButtons = (mobile = false) => {
    if (isAuthenticated) {
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
              setIsRegisterModalOpen(true); // Abrir modal de registro en lugar de navegar
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

  const mobileMenuStyles = `
    fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
    transform transition-transform duration-300 ease-in-out
    p-4 flex flex-col gap-4
    ${openMenu ? "translate-x-0" : "translate-x-full"}
  `;

  const overlayStyles = `
    fixed inset-0 z-40 backdrop-blur-sm
    transition-opacity duration-300
    ${openMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
  `;

  return (
    <div className="h-full">
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
        <div className="col-span-1 flex items-center">
          <RiAppsLine className="text-xl" />
        </div>

        <nav
          className="
          hidden md:flex md:col-span-1
          gap-4
          justify-end
        "
        >
          <div className="flex gap-4">
            <ClientNav setOpenMenu={setOpenMenu} setMobileView={() => {}} />
          </div>
        </nav>

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
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
          <button
            onClick={handleSearchClick}
            className="bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Buscar"
          >
            <IoSearchOutline />
          </button>
        </div>

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

        <div className="hidden md:flex md:col-span-1 gap-2 justify-end">
          {renderAuthButtons(false)}
        </div>
      </header>

      <div className={mobileMenuStyles}>
        <nav className="flex-1">
          <ClientNav setOpenMenu={setOpenMenu} setMobileView={() => {}} />
        </nav>

        <div className="flex flex-col gap-2 mt-4">
          {renderAuthButtons(true)}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />

      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        onSuccess={handleRegisterSuccess} 
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
