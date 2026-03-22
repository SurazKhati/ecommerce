import { Avatar, Dropdown } from "flowbite-react";
import { Navbar } from "flowbite-react";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-100 text-primary-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const HomeHeader = () => {
  const loggedInUser = useSelector((root: any) => root.auth.loggedInUser || null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-soft">
      <Navbar fluid rounded className="border-0 bg-transparent px-4 py-3 lg:px-8">
        <Navbar.Brand>
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={logo}
              className="h-10 sm:h-12"
              alt="Peoples Commerce Logo"
            />
            <span className="self-center whitespace-nowrap text-lg font-bold text-slate-800 sm:text-xl">
              Peoples Commerce
            </span>
          </NavLink>
        </Navbar.Brand>

        <div className="flex md:order-2">
          <Navbar.Collapse>
            {loggedInUser ? (
              <div className="flex items-center">
                <Dropdown
                  arrowIcon={true}
                  inline
                  label={
                    <Avatar
                      alt="User settings"
                      img={loggedInUser.image}
                      rounded
                      className="cursor-pointer ring-2 ring-primary-100"
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm font-semibold">{loggedInUser.name}</span>
                    <span className="block truncate text-sm text-slate-500">
                      {loggedInUser.email}
                    </span>
                  </Dropdown.Header>
                  <NavLink to={"/" + loggedInUser.role}>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                  </NavLink>
                  <Dropdown.Divider />
                  <NavLink to="/logout">
                    <Dropdown.Item>Sign out</Dropdown.Item>
                  </NavLink>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/register"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700"
                >
                  Login
                </NavLink>
              </div>
            )}
          </Navbar.Collapse>
          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/contacts" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/aboutus" className={navLinkClass}>
            About Us
          </NavLink>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
