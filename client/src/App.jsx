import { useState } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log(response.data);
      alert(response.data?.message || 'Login successful');
      navigate("/home")
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  return (
      <div className="p-4 flex bg-gray-200 items-center justify-center min-h-screen">
        <div className="p-10 rounded-xl bg-white border border-gray-900 ">
          <h3 className="text-3xl text-center font-medium">Login</h3>
          <div className="p-1 mb-3">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
            />
          </div>
          <div className="p-1">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
            />
          </div>
          <button onClick={handleLogin} className="mt-4 p-2 bg-gray-900 border rounded-2xl border-gray-700 text-white w-full hover:bg-gray-600">
            Login
          </button>
          <div className="p-2">
            Don't have an account? <a href="/register">Sign up</a>
          </div>
        </div>
      </div>
 
  );
}

export default App;
