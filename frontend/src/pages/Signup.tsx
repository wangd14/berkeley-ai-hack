import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';

export function Signup() {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
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
            setSuccess(false);
            try {
              const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, name }),
              });
              if (res.status === 201) {
                // Auto-login after signup
                const loginRes = await fetch('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                });
                if (loginRes.ok) {
                  const loginData = await loginRes.json();
                  if (loginData.access_token) {
                    setToken(loginData.access_token);
                    if (loginData.student_id) {
                      localStorage.setItem('student_id', String(loginData.student_id));
                    }
                    if (Boolean(loginData.is_teacher) === true) {
                      navigate('/teacher-dashboard');
                    } else {
                      navigate('/curriculum');
                    }
                    return;
                  }
                }
                setSuccess(true);
                setError(language === 'Shona' ? 'Kunyoresa kwabudirira asi kupinda kwatadza. Ndapota pinda nemaoko.' : 'Signup succeeded but auto-login failed. Please log in manually.');
              } else {
                const data = await res.json();
                setError(data.detail || (language === 'Shona' ? 'Kunyoresa kwatadza' : 'Signup failed'));
              }
            } catch (err) {
              setError(language === 'Shona' ? 'Kunyoresa kwatadza: Dambudziko reInternet' : 'Signup failed: Network error');
            }
          }}
        >
          <h2 className="text-2xl font-bold mb-6">{language === 'Shona' ? 'Nyoresa' : 'Sign Up'}</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            className="w-full mb-4 p-2 border rounded"
            type="text"
            placeholder={language === 'Shona' ? 'Zita rizere' : 'Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
            {language === 'Shona' ? 'Nyoresa' : 'Sign Up'}
          </button>
          <div className="mt-4 text-sm text-center">
            {language === 'Shona' ? 'Une account? ' : 'Already have an account? '}
            <a href="/login" className="text-blue-600">
              {language === 'Shona' ? 'Pinda' : 'Login'}
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
