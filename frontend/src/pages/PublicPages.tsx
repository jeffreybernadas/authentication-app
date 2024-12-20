import NavigationBar from "@/components/ui/navigation-bar";
import { Outlet } from "react-router-dom";

const PublicPages = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
};

export default PublicPages;
