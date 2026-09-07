import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-shopee-primary text-white sticky top-0 z-50 shadow-md">
      {/* 頂部小導覽列 */}
      <div className="max-w-6xl mx-auto px-4 py-1 text-xs flex justify-between border-b border-orange-400/30">
        <div className="flex gap-4">
          <Link to="/seller" className="hover:opacity-80">賣家中心</Link>
          <span>|</span>
          <a href="#" className="hover:opacity-80">下載蝦皮 App</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="hover:opacity-80 font-medium">登入</Link>
          <span>|</span>
          <Link to="/register" className="hover:opacity-80 font-medium">註冊</Link>
        </div>
      </div>

      {/* 主搜尋列與購物車區塊 */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <ShoppingCart className="w-8 h-8" />
          <span>Shopee Clone</span>
        </Link>

        {/* 搜尋欄 */}
        <div className="flex-1 max-w-2xl relative">
          <div className="flex bg-white rounded-sm overflow-hidden p-1 shadow-inner">
            <input
              type="text"
              placeholder="搜尋商品、品牌與賣家..."
              className="w-full px-3 py-1.5 text-black outline-none text-sm"
            />
            <button className="bg-shopee-primary text-white px-6 py-1.5 rounded-sm hover:bg-shopee-hover transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 購物車圖示 */}
        <Link to="/cart" className="relative p-2 hover:opacity-80">
          <ShoppingCart className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 bg-white text-shopee-primary text-xs font-bold rounded-full px-1.5 py-0.5 border border-shopee-primary">
            0
          </span>
        </Link>
      </div>
    </header>
  );
}