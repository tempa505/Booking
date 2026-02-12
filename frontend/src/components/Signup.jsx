import { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/signup", formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="font-bold text-xl mb-2">Sign Up</h2>
      <input name="username" onChange={handleChange} placeholder="Username" required className="w-full p-2 border rounded" />
      <input name="email" type="email" onChange={handleChange} placeholder="Email (optional)" className="w-full p-2 border rounded" />
      <input name="phone" type="tel" onChange={handleChange} placeholder="Phone Number (optional)" className="w-full p-2 border rounded" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
    </form>
  );
}

export default Signup;
