import React, { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { resetPassword, ResetPasswordDataType } from "@/lib/api";
import { ApiError } from "@/utils/ApiError";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const [password, setPassword] = useState("");

  const {
    mutate: passwordReset,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation<unknown, ApiError, ResetPasswordDataType>({
    mutationFn: resetPassword,
    onSuccess: () => {
      setPassword("");
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = { password, verificationCode: code };
      passwordReset(data);
    },
    [password, passwordReset, code]
  );

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Change your Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
        {isError && (
          <span className="text-red-500 text-sm text-center">
            {error.response.data.message}
          </span>
        )}
        {isSuccess && (
          <span className="text-green-500 text-sm text-center">
            Password updated successfully!
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="reset-password-form-password">New Password</Label>
              <Input
                id="reset-password-form-password"
                type="password"
                placeholder="*******"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={!password}
              isLoading={isPending}
            >
              Reset Password
            </Button>
          </form>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
