import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('台北市信義區市府路 1 號');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get('/cart/')
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 勾選邏輯
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 刪除項目
  const handleDelete = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  // 計算總價
  const totalPrice = cartItems
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  // 觸發 ACID 結帳下單
  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      alert('請勾選至少一項商品');
      return;
    }

    try {
      const res = await api.post('/orders/', {
        shipping_address: shippingAddress,
        cart_item_ids: selectedIds
      });
      alert(`訂單建立成功！訂單編號: ${res.data.order_number}`);
      setSelectedIds([]);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.detail || '結帳失敗');
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-10 text-center text-lg text-slate-500">購物車載入中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="mb-5 text-3xl font-bold text-gray-800">我的購物車</h2>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-14 text-center shadow-lg shadow-slate-200/60">
          <p className="mb-5 text-lg text-gray-500">你的購物車是空的</p>
          <button onClick={() => navigate('/')} className="rounded-lg bg-shopee-primary px-7 py-3 text-base font-bold text-white shadow hover:bg-shopee-hover">
            去逛逛商品
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 列表標頭 */}
          <div className="grid grid-cols-12 rounded-xl bg-white p-5 text-base font-medium text-gray-500 shadow-sm">
            <span className="col-span-6">商品</span>
            <span className="col-span-2 text-center">單價</span>
            <span className="col-span-2 text-center">數量</span>
            <span className="col-span-2 text-center">操作</span>
          </div>

          {/* 購物車項目 */}
          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 items-center rounded-xl bg-white p-5 text-base shadow-sm">
              <div className="col-span-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-4 h-4 accent-shopee-primary"
                />
                <img src={item.cover_image || "https://via.placeholder.com/80"} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-gray-800 line-clamp-1">{item.product_title}</p>
                  <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-sm text-gray-500">規格: {item.sku_name}</span>
                </div>
              </div>
              <span className="col-span-2 text-center text-shopee-primary font-bold">${item.price}</span>
              <span className="col-span-2 text-center">{item.quantity}</span>
              <div className="col-span-2 text-center">
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}

          {/* 底部結帳列 */}
          <div className="sticky bottom-0 flex items-center justify-between rounded-xl border-t border-orange-200 bg-white p-5 shadow-lg shadow-orange-100">
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-600">寄送地址:</span>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-72 rounded-lg border border-gray-300 px-3 py-2 text-base"
              />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-base text-gray-600">總金額 ({selectedIds.length} 個商品): </span>
                <span className="text-3xl font-bold text-shopee-primary">${totalPrice}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="rounded-lg bg-shopee-primary px-8 py-3.5 text-base font-bold text-white shadow transition-colors hover:bg-shopee-hover"
              >
                去結帳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
