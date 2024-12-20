import useAuth, { AuthDataType } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user as AuthDataType;
  
  return (
    <div>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <h1 className="text-4xl font-bold m-4 text-center">My Account</h1>
        {!verified && (
          <div className="bg-yellow-400 p-2 rounded m-4 bg-opacity-75 text-white">
            Please verify your email address
          </div>
        )}
        <h3 className="text-center">Email: {email}</h3>
        <h3 className="text-center">
          Created on {new Date(createdAt).toLocaleDateString("en-US")}
        </h3>
      </div>
    </div>
  );
};

export default Profile;
