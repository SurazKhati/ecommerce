import { Avatar, Dropdown } from "flowbite-react";
import { Navbar } from "flowbite-react";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRouteForRole } from "../../../utils/role-route";
import { useTheme } from "../../../context/theme.context";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-primary-100 text-primary-700 shadow-sm dark:bg-primary-900/40 dark:text-primary-200"
      : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

export const HomeHeader = () => {
  const loggedInUser = useSelector((root: any) => root.auth.loggedInUser || null);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 lg:px-8">
        <Navbar fluid rounded className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 px-3 py-3 shadow-soft transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/85 sm:px-4 lg:px-6">
        <Navbar.Brand>
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src={logo}
              className="h-10 w-10 rounded-2xl border border-primary-100 bg-amber-50 p-1.5 shadow-sm sm:h-12 sm:w-12"
              alt="Peoples Commerce Logo"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-600 sm:text-[11px] sm:tracking-[0.28em]">
                Smart Kitchen Store
              </p>
              <span className="block self-center whitespace-nowrap text-[1.95rem] font-bold leading-none text-slate-800 dark:text-white sm:text-2xl">
                Peoples Commerce
              </span>
            </div>
          </NavLink>
        </Navbar.Brand>

        <div className="flex items-center gap-2 md:order-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative inline-flex h-10 w-[104px] items-center rounded-full border px-2 shadow-sm transition-all duration-300 sm:h-12 sm:w-[118px] ${
              isDark
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
            aria-label="Toggle dark mode"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            <span
              className={`absolute top-1 h-8 w-[46px] rounded-full transition-all duration-300 sm:top-1.5 sm:h-9 sm:w-[52px] ${
                isDark
                  ? "left-[54px] bg-slate-700 sm:left-[60px]"
                  : "left-1 bg-amber-100 sm:left-1.5"
              }`}
            />
            <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-sm font-semibold sm:px-2">
              <span className={isDark ? "text-slate-400" : "text-slate-900"}>Light</span>
              <span className={isDark ? "text-white" : "text-slate-400"}>Dark</span>
            </span>
          </button>
          <Navbar.Collapse>
            {loggedInUser ? (
              <div className="flex items-center">
                <Dropdown
                  arrowIcon={true}
                  inline
                  label={
                    <div className="rounded-2xl border border-primary-100 bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <Avatar
                        alt="User settings"
                        img={loggedInUser.image}
                        rounded
                        className="cursor-pointer ring-2 ring-primary-100"
                      />
                    </div>
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm font-semibold">{loggedInUser.name}</span>
                    <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
                      {loggedInUser.email}
                    </span>
                  </Dropdown.Header>
                  <NavLink to={getRouteForRole(loggedInUser.role)}>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                  </NavLink>
                  <Dropdown.Divider />
                  <NavLink to="/logout">
                    <Dropdown.Item>Sign out</Dropdown.Item>
                  </NavLink>
                </Dropdown>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink
                  to="/register"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-card"
                >
                  Login
                </NavLink>
              </div>
            )}
          </Navbar.Collapse>
          <Navbar.Toggle className="rounded-2xl border border-slate-200 p-2.5 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" />
        </div>

        <Navbar.Collapse>
          <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-slate-50/90 p-2 shadow-inner dark:bg-slate-800/70 md:mt-0 md:flex-row md:items-center md:rounded-full md:border md:border-slate-200/70 md:px-3 md:py-2 dark:md:border-slate-700">
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
            {!loggedInUser ? (
              <div className="mt-1 flex gap-2 md:hidden">
                <NavLink
                  to="/register"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Login
                </NavLink>
              </div>
            ) : null}
          </div>
        </Navbar.Collapse>
      </Navbar>
      </div>
    </header>
  );
};
