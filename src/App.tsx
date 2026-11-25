import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadDocument from "./pages/UploadDocument";
import SearchDocument from "./pages/SearchDocument";
import Admin from "./pages/Admin";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Main application component.
// Configures client-side navigation and defines public and protected routes.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* All other routes are protected */}
        {/* Authentication wrapper: Prevents unauthenticated users from accessing protected pages. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/search" element={<SearchDocument />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        {/* Fallback route: Redirects unknown URLs to the dashboard. */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
