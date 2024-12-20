import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useMutation } from "@tanstack/react-query";
import { register, RegisterDataType } from "@/lib/api";
import { ApiError } from "@/utils/ApiError";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [registerFormValue, setRegisterFormValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    mutate: signUp,
    isPending,
    isError,
    error,
  } = useMutation<unknown, ApiError, RegisterDataType>({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      signUp(registerFormValue);
    },
    [registerFormValue, signUp]
  );
  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("registerText")}</CardTitle>
          <CardDescription>{t("registerFill")}</CardDescription>
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
                <Label htmlFor="register-form-email">{t("emailText")}</Label>
                <Input
                  autoFocus
                  id="register-form-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={registerFormValue.email}
                  onChange={(e) =>
                    setRegisterFormValue({
                      ...registerFormValue,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2 mt-4">
                <Label htmlFor="register-form-password">
                  {t("passwordText")}
                </Label>
                <Input
                  id="register-form-password"
                  type="password"
                  placeholder="*******"
                  required
                  value={registerFormValue.password}
                  onChange={(e) =>
                    setRegisterFormValue({
                      ...registerFormValue,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2 mt-4">
                <Label htmlFor="register-form-confirmpassword">
                  {t("passwordConfirmText")}
                </Label>
                <Input
                  id="register-form-confirmpassword"
                  type="password"
                  placeholder="*******"
                  required
                  value={registerFormValue.confirmPassword}
                  onChange={(e) =>
                    setRegisterFormValue({
                      ...registerFormValue,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={
                  !registerFormValue.email ||
                  registerFormValue.password.length < 6 ||
                  registerFormValue.password !==
                    registerFormValue.confirmPassword
                }
                isLoading={isPending}
              >
                {t("registerText")}
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
              {t("rWithGoogle")}
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
              {t("rWithGithub")}
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
              {t("rWithDiscord")}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t("hasAccount")}{" "}
            <Link to="/login" className="underline">
              {t("loginText")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
