import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck } from 'lucide-react';
import api from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.skus && res.data.skus.length > 0) {
          setSelectedSku(res.data.skus[0]); // 預設選取第一個規格
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("載入商品失敗:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto p-8 text-center text-gray-500">商品資料載入中...</div>;
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto p-8 text-center text-red-500">找不到該商品或商品已下架</div>;
  }

  // 計算價格範圍顯示
  const prices = product.skus.map(s => s.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleAddToCart = async () => {
    if (!selectedSku) {
      setMessage('請選擇商品規格');
      return;
    }

    try {
      await api.post('/cart/', {
        sku_id: selectedSku.id,
        quantity: quantity
      });
      setMessage('成功加入購物車！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('請先登入會員');
        navigate('/login');
      } else {
        setMessage(err.response?.data?.detail || '加入購物車失敗');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 提示訊息 */}
      {message && (
        <div className="mb-4 p-3 bg-orange-100 border border-shopee-primary text-shopee-primary text-sm rounded text-center font-bold">
          {message}
        </div>
      )}

      {/* 主要商品卡片 */}
      <div className="bg-white rounded-sm shadow-sm p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 左側：商品主圖展示 */}
        <div className="md:col-span-5">
          <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-3 border">
            <img
              src={selectedSku?.sku_image || product.cover_image || "https://via.placeholder.com/400"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 px-2">
            <span className="flex items-center gap-1 cursor-pointer hover:text-shopee-primary">
              <Heart className="w-4 h-4" /> 分享 / 喜歡 (0)
            </span>
            <span className="text-gray-400">檢舉商品</span>
          </div>
        </div>

        {/* 右側：商品資訊與規格選擇 */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {/* 標題 */}
            <h1 className="text-xl font-medium text-gray-800 mb-3 leading-snug">
              {product.title}
            </h1>

            {/* 蝦皮評價與已售出列 */}
            <div className="flex items-center gap-4 text-sm mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center text-shopee-primary font-bold">
                <span className="underline mr-1">5.0</span>
                <span>★★★★★</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">666 評價</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">1.2k 已售出</span>
            </div>

            {/* 價格帶區塊 */}
            <div className="bg-gray-50 p-4 rounded-sm mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-shopee-primary">
                ${selectedSku ? selectedSku.price : `${minPrice} - $${maxPrice}`}
              </span>
              <span className="text-xs bg-shopee-primary text-white px-1.5 py-0.5 rounded font-bold">
                限時特賣
              </span>
            </div>

            {/* 運送資訊 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="w-20 text-gray-400">運送</span>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span>免運費優惠中 (滿 $99 免運)</span>
              </div>
            </div>

            {/* 多規格按鈕選擇 */}
            <div className="flex items-start gap-4 text-sm mb-6">
              <span className="w-20 text-gray-400 mt-2">規格選項</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {product.skus.map((sku) => {
                  const isSelected = selectedSku?.id === sku.id;
                  return (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSku(sku)}
                      className={`px-4 py-2 border rounded-sm text-sm transition-all ${
                        isSelected
                          ? 'border-shopee-primary text-shopee-primary font-medium bg-orange-50'
                          : 'border-gray-300 text-gray-700 hover:border-shopee-primary'
                      }`}
                    >
                      {sku.sku_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 數量選單 */}
            <div className="flex items-center gap-4 text-sm mb-8">
              <span className="w-20 text-gray-400">數量</span>
              <div className="flex items-center border rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 border-r hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4 py-1 text-center min-w-[40px]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedSku?.stock || 99, quantity + 1))}
                  className="px-3 py-1 bg-gray-100 border-l hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">
                還剩 {selectedSku ? selectedSku.stock : 0} 件可用庫存
              </span>
            </div>
          </div>

          {/* 按鈕組 */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-shopee-primary bg-orange-50 text-shopee-primary py-3 rounded-sm font-medium hover:bg-orange-100 flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" /> 加入購物車
            </button>
            <button
              onClick={async () => {
                await handleAddToCart();
                navigate('/cart');
              }}
              className="flex-1 bg-shopee-primary text-white py-3 rounded-sm font-medium hover:bg-shopee-hover transition-colors shadow-sm"
            >
              直接購買
            </button>
          </div>
        </div>
      </div>

      {/* 下方：商品詳情與描述 */}
      <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
        <h3 className="bg-gray-50 p-3 font-bold text-gray-700 text-base mb-4">商品詳情</h3>
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line px-3">
          {product.description || "賣家暫未提供商品詳細說明。"}
        </div>
      </div>
    </div>
  );
}