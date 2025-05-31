"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
  }, [])

  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // First get CSRF cookie
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    });

    // Then post login data
    const res = await axios.post(
      'http://localhost:8000/login',
      { email, password },
      { withCredentials: true }
    );

    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      // Redirect or update UI as needed
      window.location.href = '/admin/dashboard';
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