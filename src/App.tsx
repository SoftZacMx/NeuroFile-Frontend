import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
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
import PlaceholderPage from "@/pages/PlaceholderPage";

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
          <Route path="records/new" element={<CreateExpedient />} />
          <Route path="users" element={<Users />} />
          <Route
            path="reports"
            element={
              <PlaceholderPage
                title="Reportes"
                description="Reportes y estadísticas."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Configuración"
                description="Ajustes de la plataforma."
              />
            }
          />
          <Route
            path="help"
            element={
              <PlaceholderPage
                title="Ayuda"
                description="Centro de ayuda y documentación."
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ConfirmDialogProvider>
    </AuthProvider>
  );
}

export default App;
