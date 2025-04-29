interface UserCardProps {
  id: number;
  name: string;
  timestamp: string;
  role: string;
  avatar: null;
}

const UserCard = ({ user }: { user: UserCardProps }) => {
  return (
    <div key={user.id} className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {/* Avatar circle */}
        <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>

        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{user.name}</span>
          <span className="text-sm text-gray-500">{user.timestamp}</span>
        </div>
      </div>

      <div
        className={`px-4 py-1 rounded-full text-sm ${
          user.role === "Formateur" ? "bg-blue-100 text-blue-600" : "bg-cyan-100 text-cyan-600"
        }`}
      >
        {user.role}
      </div>
    </div>
  );
};
export default UserCard;
