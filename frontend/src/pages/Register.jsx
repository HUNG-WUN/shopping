import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Store, UserRound } from 'lucide-react';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSeller, setIsSeller] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('密碼至少需要 8 個字元。');
      return;
    }
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致。');
      return;
    }

    setLoading(true);
    try {
      // 後端帳號必須有 username；以 Email 前綴加上時間戳建立不重複的顯示名稱。
      const baseName = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'shopper';
      const username = `${baseName.slice(0, 85)}_${Date.now().toString().slice(-8)}`;
      await api.post('/auth/register', { email, password, username, is_seller: isSeller });
      alert('註冊成功！請使用新帳號登入。');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || '註冊失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-10 grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-orange-950/10 md:grid-cols-2">
      <section className="hidden bg-gradient-to-br from-[#ee4d2d] via-[#f76545] to-[#ff9b45] p-10 text-white md:block">
        <Store className="mb-8 h-12 w-12" />
        <h1 className="text-3xl font-bold leading-tight">開始你的
          <br />購物與賣家旅程</h1>
        <p className="mt-4 text-base leading-7 text-orange-50">建立帳號後即可購物；開啟賣家身分，還能立即上架自己的商品。</p>
        <div className="mt-10 space-y-4 text-base">
          <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" />簡單、安全的帳號註冊</p>
          <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" />支援多規格商品管理</p>
          <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" />即時掌握庫存與訂單</p>
        </div>
      </section>

      <section className="p-7 sm:p-10">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-shopee-primary md:hidden"><Store className="h-7 w-7" /><span className="text-xl font-bold">Shopee Clone</span></div>
          <h2 className="text-3xl font-bold text-slate-800">建立帳號</h2>
          <p className="mt-2 text-base text-slate-500">只要幾個步驟，就能開始使用。</p>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-base font-medium text-slate-700"><Mail className="h-4 w-4" />Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-shopee-primary focus:ring-4 focus:ring-orange-100" required />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-base font-medium text-slate-700"><LockKeyhole className="h-4 w-4" />密碼</span>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 8 個字元" minLength="8" className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-base outline-none transition focus:border-shopee-primary focus:ring-4 focus:ring-orange-100" required />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-shopee-primary" aria-label={showPassword ? '隱藏密碼' : '顯示密碼'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-base font-medium text-slate-700"><LockKeyhole className="h-4 w-4" />確認密碼</span>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-base outline-none transition focus:border-shopee-primary focus:ring-4 focus:ring-orange-100" required />
              <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-shopee-primary" aria-label={showConfirmPassword ? '隱藏確認密碼' : '顯示確認密碼'} aria-pressed={showConfirmPassword}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <input type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} className="mt-1 h-5 w-5 accent-shopee-primary" />
            <span><span className="flex items-center gap-2 text-base font-semibold text-slate-800"><UserRound className="h-4 w-4 text-shopee-primary" />註冊為賣家</span><span className="mt-1 block text-sm leading-5 text-slate-600">勾選後可進入賣家中心並上架商品。</span></span>
          </label>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-shopee-primary py-3.5 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-shopee-hover disabled:cursor-not-allowed disabled:opacity-60">{loading ? '註冊中…' : '建立帳號'}</button>
        </form>
        <p className="mt-6 text-center text-base text-slate-500">已有帳號？ <Link to="/login" className="font-semibold text-shopee-primary hover:underline">立即登入</Link></p>
      </section>
    </div>
  );
}
