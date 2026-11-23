import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
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

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="w-full bg-slate-900 text-white md:min-h-screen md:w-64">
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-xl font-bold">DMS Portal</h1>
          <p className="mt-1 text-xs text-slate-400">
            Document Management System
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
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

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="font-semibold text-slate-800">Document Management</h2>

          <span className="text-sm text-slate-500">Admin</span>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
