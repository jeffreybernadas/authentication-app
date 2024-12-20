import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
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
// import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/utils/ApiError";
import { forgotPassword } from "@/lib/api";

const ForgotPassword = () => {
  const [emailToReset, setEmailToReset] = useState<string>("");
  //   const { t } = useTranslation();
  const {
    mutate: passwordForgot,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation<unknown, ApiError, string>({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setEmailToReset("");
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      passwordForgot(emailToReset);
    },
    [emailToReset, passwordForgot]
  );
  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset your Password</CardTitle>
          <CardDescription>
            Enter your email below to reset password.
          </CardDescription>
          {isError && (
            <span className="text-red-500 text-sm text-center">
              {error.response.data.message}
            </span>
          )}
          {isSuccess && (
            <span className="text-green-500 text-sm text-center">
              Email sent successfully. Check it for instructions.
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="forgot-password-email">Email Address</Label>
                <Input
                  id="forgot-password-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={emailToReset}
                  onChange={(e) => setEmailToReset(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={!emailToReset}
                isLoading={isPending}
              >
                Reset Password
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Go back to{" "}
            <Link to="/login" className="underline">
              Login
            </Link>{" "}
            or{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
