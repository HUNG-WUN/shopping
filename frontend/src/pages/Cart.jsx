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

  if (loading) return <div className="max-w-6xl mx-auto p-8 text-center">購物車載入中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">我的購物車</h2>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm shadow-sm">
          <p className="text-gray-500 mb-4">你的購物車是空的</p>
          <button onClick={() => navigate('/')} className="bg-shopee-primary text-white px-6 py-2 rounded-sm text-sm">
            去逛逛商品
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 列表標頭 */}
          <div className="bg-white p-4 rounded-sm shadow-sm grid grid-cols-12 text-sm text-gray-500">
            <span className="col-span-6">商品</span>
            <span className="col-span-2 text-center">單價</span>
            <span className="col-span-2 text-center">數量</span>
            <span className="col-span-2 text-center">操作</span>
          </div>

          {/* 購物車項目 */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-sm shadow-sm grid grid-cols-12 items-center text-sm">
              <div className="col-span-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-4 h-4 accent-shopee-primary"
                />
                <img src={item.cover_image || "https://via.placeholder.com/80"} alt="" className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium text-gray-800 line-clamp-1">{item.product_title}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">規格: {item.sku_name}</span>
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
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center justify-between sticky bottom-0 border-t border-orange-200">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">寄送地址:</span>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-72"
              />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-gray-600">總金額 ({selectedIds.length} 個商品): </span>
                <span className="text-2xl font-bold text-shopee-primary">${totalPrice}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-shopee-primary text-white px-8 py-3 rounded-sm font-medium hover:bg-shopee-hover transition-colors"
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