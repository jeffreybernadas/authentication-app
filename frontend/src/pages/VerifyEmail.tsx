import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ResponseDataType, verifyEmail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/utils/ApiError";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const {
    isPending,
    isSuccess,
    isError,
    error,
    data: responseData,
  } = useQuery<unknown, ApiError, ResponseDataType>({
    queryKey: ["emailVerification", code], // Unique key for the query
    queryFn: async () => verifyEmail(code as string), // Function that returns the promise
  });
  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center flex-col">
      <div
        className={`${
          isSuccess ? "bg-green-500" : "bg-red-500"
        } p-2 rounded m-4 bg-opacity-75 text-white`}
      >
        {isSuccess ? responseData.data.message : "Failed to verify"}
      </div>
      {isPending && <Loader2 className="w-10 h-10 animate-spin" />}
      {isError && (
        <p>
          {error.response.data.message}{" "}
          <Link to="/register" className="text-sky-600">
            Get a new link
          </Link>
        </p>
      )}
      <Button className="mt-4" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  );
};

export default VerifyEmail;
