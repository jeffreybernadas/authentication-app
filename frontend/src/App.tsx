import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import AppContainer from "@/pages/AppContainer";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Settings from "@/pages/Settings";
import PublicPages from "@/pages/PublicPages";
import AdminRoute from "@/pages/AdminRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFoundPage from "@/pages/NotFoundPage";
import { Toaster } from "@/components/ui/toaster";
import { setNavigate } from "@/lib/navigation";

function App() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  setNavigate(navigate);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(error);
    }
  }, [location.search]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Conflict",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage, toast]);

  return (
    <>
      <Routes>
        <Route path="/" element={<AppContainer />}>
          <Route index element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={<AdminRoute allowedRoles={["Admin"]} />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route element={<PublicPages />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/api/v1/auth/email/verify/:code"
            element={<VerifyEmail />}
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route
            path="/api/v1/auth/password/reset"
            element={<ResetPassword />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
