import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionDataType } from "@/hooks/useSessions";
import useDeleteSession from "@/hooks/useDeleteSession";

const SessionCard = ({ session }: { session: SessionDataType }) => {
  const { _id, createdAt, userAgent, isCurrent } = session;
  const { deleteSession, isPending } = useDeleteSession(_id);
  return (
    <Card className="m-1 w-[600px]" key={`session-${_id}`}>
      <div className="flex justify-between items-center p-2">
        <div>
          <CardHeader className="p-3">
            <CardTitle>
              {new Date(createdAt).toLocaleString("en-US")}
              {isCurrent && " (Current Session)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-0">
            <CardDescription>{userAgent}</CardDescription>
          </CardContent>
        </div>
        {!isCurrent && (
          <X
            className={`max-w-3 max-h-3 cursor-pointer mx-4 text-red-500 hover:${
              isPending ? "text-gray-600" : "text-red-600"
            }`}
            onClick={() => deleteSession()}
          />
        )}
      </div>
    </Card>
  );
};

export default SessionCard;
