import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

// Navigation configuration for the application's sidebar.
const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    name: "Upload Document",
    path: "/upload",
    icon: "↑",
  },
  {
    name: "Search Document",
    path: "/search",
    icon: "⌕",
  },
  {
    name: "Admin",
    path: "/admin",
    icon: "⚙",
  },
];

// Main layout component.
// Provides a shared sidebar, header, navigation, and content area
// for all authenticated pages.
const MainLayout = () => {
  const navigate = useNavigate();

  // Handles user logout by removing the authentication token
  // and redirecting the user to the login page.
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar: Displays application branding and navigation links. */}

      <aside className="w-full bg-slate-900 text-white md:min-h-screen md:w-64">
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-xl font-bold">DMS Portal</h1>
          <p className="mt-1 text-xs text-slate-400">
            Document Management System
          </p>
        </div>

        {/* Navigation: Maps the navigation configuration into clickable links. */}
        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              // end={item.path === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area: Contains the application header and active page. */}

      <main className="min-w-0 flex-1">
        {/* Header: Displays the application title and logout action. */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="font-semibold text-slate-800">Document Management</h2>

          {/* Logout button: Ends the current authenticated session. */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Outlet: Renders the currently selected nested route. */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
