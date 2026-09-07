import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';

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
    <div className="max-w-md mx-auto my-10 rounded-2xl bg-white p-7 shadow-xl shadow-slate-200/70 sm:p-9">
      <div className="mb-8 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-shopee-primary"><LogIn className="h-6 w-6" /></div><h2 className="text-3xl font-bold text-slate-800">會員登入</h2><p className="mt-2 text-base text-slate-500">歡迎回來，繼續你的購物旅程。</p></div>
      {error && <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-base font-medium text-slate-700"><Mail className="h-4 w-4" />Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-shopee-primary focus:ring-4 focus:ring-orange-100"
            required
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2 text-base font-medium text-slate-700"><LockKeyhole className="h-4 w-4" />密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-shopee-primary focus:ring-4 focus:ring-orange-100"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-shopee-primary py-3.5 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-shopee-hover"
        >
          登入
        </button>
      </form>
      <div className="mt-6 text-center text-base text-slate-500">
        還沒有帳號？ <Link to="/register" className="text-shopee-primary">立即註冊</Link>
      </div>
    </div>
  );
}
