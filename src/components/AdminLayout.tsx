import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { COMPANY } from "../config/company";
import { NAV_ITEMS } from "../config/navigation";
import logo from "../assets/logo-ait.jpg";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    // The shell is exactly one screen tall. The sidebar / top bar never move;
    // only <main> scrolls.
    <div className="flex h-full overflow-hidden">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-ink text-white md:flex">
        <div className="border-b border-white/10 px-4 pb-4 pt-5 text-center">
          <img src={logo} alt="AIT" className="mx-auto h-24 w-24 rounded-2xl object-cover ring-1 ring-brand/40" />
          <div className="mt-3 text-sm font-semibold tracking-wide text-brand-light">AICH Admin</div>
          <div className="text-xs text-white/50">{COMPANY.location.split(",")[0]}</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2 rounded px-3 py-2 text-sm no-underline ${
                  isActive
                    ? "bg-gradient-to-b from-brand-light to-brand font-semibold text-ink"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {n.icon}
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-3 rounded border border-brand/40 bg-transparent px-3 py-2 text-sm text-brand-light hover:bg-brand/10">
          Sign out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between bg-ink px-4 py-2 md:hidden">
          <span className="flex items-center gap-2 font-semibold text-brand-light">
            <img src={logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
            AICH Admin
          </span>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-primary">Sign out</button>
        </header>
        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b bg-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map((n) => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => `flex items-center gap-1 whitespace-nowrap rounded px-3 py-1 text-sm no-underline ${isActive ? "bg-gradient-to-b from-brand-light to-brand font-semibold text-ink" : "text-gray-700"}`}>
              {n.icon}{n.label}
            </NavLink>
          ))}
        </nav>

        {/* The only scrolling area of the admin */}
        <main className="app-scroll min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
