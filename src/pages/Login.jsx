import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  setError("");
  alert("Login Successful!");
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
            Logo
          </div>
          <h2 className="text-2xl font-bold mt-4">Login</h2>
          <p className="text-gray-500">Welcome back!</p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex justify-end">
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-blue-600 text-sm"
            >
                {showPassword ? "Hide Password" : "Show Password"}
            </button>
              
            
          </div>

          {error &&(
            <p className="text-red-500 text-sm">
                {error}
            </p>
          )}
          

          <Button onClick={handleLogin}>
            Login
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Login;
