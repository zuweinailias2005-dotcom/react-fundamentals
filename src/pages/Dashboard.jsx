import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">
        Welcome {user?.name || "User"} 👋
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;