import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-md w-80"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          try {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.access_token) {
                setToken(data.access_token);
                if (Boolean(data.is_teacher) === true) {
                  navigate('/teacher-dashboard');
                } else {
                  navigate('/curriculum');
                }
              } else {
                setError('Login failed: Invalid response');
              }
            } else {
              setError('Login failed: Incorrect username or password');
            }
          } catch (err) {
            setError('Login failed: Network error');
          }
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          type="submit"
        >
          Login
        </button>
        <div className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
