import { useState } from "react";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", credentials);
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <h2 className="font-bold text-xl mb-2">Login</h2>
      <input
        name="emailOrPhone"
        onChange={handleChange}
        placeholder="Email or Phone"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
    </form>
  );
}

export default Login;
