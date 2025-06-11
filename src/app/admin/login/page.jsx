"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login";
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
  }, [])

  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { email, password });

    const { user } = res.data;

    // 💾 Save to localStorage if needed
    localStorage.setItem('role', user.role);
    localStorage.setItem('permissions', JSON.stringify(user.permissions));

    // console.log("Logged in as:", user.role);
    // console.log("Permissions:", user.permissions);

    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      // Redirect or update UI as needed
      window.location.href = '/admin/dashboard/posts';
    }
  } catch (err) {
    console.log(err);
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl mb-4">Admin Login</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 border"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <label>Password</label>
        <input
          type="password"
          className="w-full p-2 mb-4 border"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}