import { Loader2 } from "lucide-react";
import useSession from "@/hooks/useSessions";
import SessionCard from "@/components/ui/session-card";

const Settings = () => {
  const { sessions, isPending, isError } = useSession();
  return (
    <div>
      <div className="flex h-[calc(100vh-4rem)] flex-col w-[600px] items-center mx-auto">
        <h1 className="text-4xl font-bold m-4 text-center">My Sessions</h1>
        {isPending && <Loader2 className="w-10 h-10 animate-spin" />}
        {isError && (
          <div className="bg-red-500 p-2 rounded m-4 bg-opacity-75 text-white">
            Failed to get sessions. Kindly restart the browser.
          </div>
        )}
        {sessions?.map((session) => {
          return (
            <SessionCard session={session} key={`session-${session._id}`} />
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
