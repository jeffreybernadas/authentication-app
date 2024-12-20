import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, LoginDataType } from "@/lib/api";
import { ApiError } from "@/utils/ApiError";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [loginFormValue, setLoginFormValue] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  // If the user is redirected to the login page from another page, we will redirect them back to that page after login
  const redirectUrl = location.state?.redirectUrl || "/";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    mutate: signIn, // This is the function that will trigger the mutation
    isPending,
    isError,
    error,
  } = useMutation<unknown, ApiError, LoginDataType>({
    mutationFn: login, // This is the function that will be called when the mutation is triggered
    onSuccess: () => {
      navigate(redirectUrl, { replace: true });
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      signIn(loginFormValue);
    },
    [loginFormValue, signIn]
  );
  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("loginText")}</CardTitle>
          <CardDescription>{t("loginFill")}</CardDescription>
          {isError && (
            <span className="text-red-500 text-sm text-center">
              {error.response.data.message}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="login-form-email">{t("emailText")}</Label>
                <Input
                  id="login-form-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={loginFormValue.email}
                  onChange={(e) =>
                    setLoginFormValue({
                      ...loginFormValue,
                      email: e.target.value,
                    })
                  }
                  autoFocus
                />
              </div>
              <div className="grid gap-2 mt-4">
                <div className="flex items-center">
                  <Label htmlFor="login-form-password">
                    {t("passwordText")}
                  </Label>
                  <Link
                    to="/password/forgot"
                    className="ml-auto inline-block text-sm underline"
                  >
                    {t("passwordForgot")}
                  </Link>
                </div>
                <Input
                  id="login-form-password"
                  type="password"
                  placeholder="*******"
                  required
                  value={loginFormValue.password}
                  onChange={(e) =>
                    setLoginFormValue({
                      ...loginFormValue,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={
                  !loginFormValue.email || loginFormValue.password.length < 6
                }
                isLoading={isPending}
              >
                {t("loginText")}
              </Button>
            </form>
            <Button
              variant="google"
              className="w-full"
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_URL}/api/v1/auth/google`,
                  "_self"
                );
              }}
            >
              {t("withGoogle")}
            </Button>
            <Button
              variant="github"
              className="w-full"
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_URL}/api/v1/auth/github`,
                  "_self"
                );
              }}
            >
              {t("withGithub")}
            </Button>
            <Button
              variant="discord"
              className="w-full"
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_URL}/api/v1/auth/discord`,
                  "_self"
                );
              }}
            >
              {t("withDiscord")}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t("noAccount")}{" "}
            <Link to="/register" className="underline">
              {t("registerText")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
