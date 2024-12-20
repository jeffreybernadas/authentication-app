import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "@/components/reset-password-form";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const expiresAt = Number(searchParams.get("expiresAt"));
  const now = Date.now();
  const linkIsValid = code && expiresAt && expiresAt > now;
  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
      {linkIsValid ? (
        <ResetPasswordForm code={code} />
      ) : (
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-500">
              Invalid link
            </CardTitle>
            <CardDescription>
              The link is either invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm">
              Request a new password reset{" "}
              <Link to="/password/forgot" className="underline">
                link.
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPassword;
