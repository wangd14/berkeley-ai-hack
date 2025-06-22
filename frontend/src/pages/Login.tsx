import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';

export function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();

  return (
    <>
      <Header />
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
                  setError(language === 'Shona' ? 'Kutadza kupinda: Mhinduro isiriyo' : 'Login failed: Invalid response');
                }
              } else {
                setError(language === 'Shona' ? 'Kutadza kupinda: Zita remushandisi kana password hazvina kunaka' : 'Login failed: Incorrect username or password');
              }
            } catch (err) {
              setError(language === 'Shona' ? 'Kutadza kupinda: Dambudziko reInternet' : 'Login failed: Network error');
            }
          }}
        >
          <h2 className="text-2xl font-bold mb-6">{language === 'Shona' ? 'Pinda' : 'Login'}</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            className="w-full mb-4 p-2 border rounded"
            type="text"
            placeholder={language === 'Shona' ? 'Zita remushandisi' : 'Username'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder={language === 'Shona' ? 'Pasiwedhi' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            type="submit"
          >
            {language === 'Shona' ? 'Pinda' : 'Login'}
          </button>
          <div className="mt-4 text-sm text-center">
            {language === 'Shona' ? 'Hauna account? ' : "Don't have an account? "}
            <a href="/signup" className="text-blue-600">
              {language === 'Shona' ? 'Nyoresa' : 'Sign up'}
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
