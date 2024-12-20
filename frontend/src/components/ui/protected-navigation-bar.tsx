import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "./language-toggle";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import { UserMenu } from "./user-menu";

const ProtectedNavigationBar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <div className="h-16 w-full flex justify-between items-center px-8 border-b-4">
        <h1 className="text-2xl font-bold cursor-pointer">
          <Link to="/">{t("appName")}</Link>
        </h1>
        <div className="flex space-x-4">
          <LanguageToggle />
          <ModeToggle />
          {user && <UserMenu />}
        </div>
      </div>
    </div>
  );
};

export default ProtectedNavigationBar;
