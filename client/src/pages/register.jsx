import { useState } from "react";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, username, password, confirm: confirmPass });
      console.log(response.data);
      alert(response.data?.message || 'Registered successfully');
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  return(
     <div className="p-4 flex bg-gray-200 items-center justify-center min-h-screen">
        <div className="p-10 rounded-xl bg-white border border-gray-900 ">
          <h3 className="text-3xl text-center font-medium">Register</h3>
          <div className="p-1">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Name"
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
           <div className="p-1">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Username"
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
           <div className="p-1">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="p-1">
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="mt-1 p-2 border border-gray-700 rounded-2xl w-full"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}            />
          </div>
          <button onClick={handleRegister} className="mt-4 p-2 bg-gray-900 border rounded-2xl border-gray-700 text-white w-full hover:bg-gray-600">
            Register
          </button>
          <div className="p-2">
            Already have an account? <a href="/">Login</a>
          </div>
        </div>
      </div>
 
  );
}

export default register;