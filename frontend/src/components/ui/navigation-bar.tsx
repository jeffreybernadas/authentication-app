import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "./language-toggle";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const showLogin = location.pathname === "/register";
  const showRegister = location.pathname === "/login";
  return (
    <div>
      <div className="h-16 w-full flex justify-between items-center px-8 border-b-4">
        <h1 className="text-2xl font-bold cursor-pointer">
          <Link to="/">{t("appName")}</Link>
        </h1>
        <div className="flex space-x-4">
          {showLogin && (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
          {showRegister && (
            <Button onClick={() => navigate("/register")}>Register</Button>
          )}
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
