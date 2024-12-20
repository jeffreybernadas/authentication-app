import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center flex-col">
      <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
      <Button className="mt-12" onClick={handleClick}>
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundPage;
