import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      alert('登入成功！');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || '登入失敗，請檢查帳號密碼');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-sm shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">會員登入</h2>
      {error && <div className="mb-4 text-xs text-red-500 bg-red-50 p-2 rounded">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2 text-sm outline-none focus:border-shopee-primary"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 text-sm outline-none focus:border-shopee-primary"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-shopee-primary text-white py-2.5 rounded-sm font-medium hover:bg-shopee-hover transition-colors"
        >
          登入
        </button>
      </form>
      <div className="mt-4 text-center text-xs text-gray-500">
        還沒有帳號？ <Link to="/register" className="text-shopee-primary">立即註冊</Link>
      </div>
    </div>
  );
}