import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user)); 


      // Set context
      setUser({
        ...user,
        isAuthenticated: true,
      });

      
      if (user.role === "superadmin") {
        navigate("/");
      } else {
        navigate("/orders");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#93A87E]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border-t-8 border-[#49951C]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#49951C]">
          Admin Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-[#93A87E] rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#A2D286]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-[#93A87E] rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#A2D286]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#49951C] hover:bg-[#3b7c18] text-white font-semibold py-3 rounded-md transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
