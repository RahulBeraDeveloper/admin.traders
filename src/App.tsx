import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProformaInvoicePage from "./pages/ProformaInvoicePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoices" element={<ProformaInvoicePage />} />
          <Route path="/proforma-invoice" element={<Navigate to="/invoices" replace />} />
          {/* Add future modules here: /buyers, /products, /shipments ... */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
