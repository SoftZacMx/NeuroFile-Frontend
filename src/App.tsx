import { Toaster } from "sonner";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfirmDialogProvider } from "@/contexts/ConfirmDialogContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Patients from "@/pages/Patients";
import PatientDetail from "@/pages/PatientDetail";
import CreateExpedient from "@/pages/CreateExpedient";
import Records from "@/pages/Records";

function App() {
  return (
    <AuthProvider>
      <ConfirmDialogProvider>
        <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:patientId" element={<PatientDetail />} />
          <Route path="records" element={<Outlet />}>
            <Route index element={<Records />} />
            <Route path="new" element={<CreateExpedient />} />
          </Route>
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ConfirmDialogProvider>
    </AuthProvider>
  );
}

export default App;
