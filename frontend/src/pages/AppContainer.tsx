import ProtectedNavigationBar from "@/components/ui/protected-navigation-bar";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return (
    <>
      <ProtectedNavigationBar />
      <div>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : user ? (
            <Outlet />
          ) : (
            <Navigate
              to="/login"
              replace
              state={{ redirectUrl: window.location.pathname }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AppContainer;
