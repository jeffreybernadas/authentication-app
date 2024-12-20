import { Outlet } from "react-router-dom";
import ProtectedNavigationBar from "@/components/ui/protected-navigation-bar";
import useAuth from "@/hooks/useAuth";

const AdminRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();
  return (
    <>
      <ProtectedNavigationBar />
      <div>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          {user && allowedRoles.includes(user.role) ? (
            <Outlet />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AdminRoute;
