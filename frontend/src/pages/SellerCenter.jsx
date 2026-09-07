import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, PackagePlus } from 'lucide-react';
import api from '../api/axios';

export default function SellerCenter() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // 多規格狀態 (預設包含一個規格)
  const [skus, setSkus] = useState([
    { sku_name: '預設規格', price: '100', stock: '50', sku_image: '' }
  ]);
  const [message, setMessage] = useState('');

  // 新增規格輸入列
  const handleAddSku = () => {
    setSkus([...skus, { sku_name: '', price: '', stock: '', sku_image: '' }]);
  };

  // 刪除規格輸入列
  const handleRemoveSku = (index) => {
    if (skus.length === 1) {
      alert('商品至少需要包含一種規格！');
      return;
    }
    setSkus(skus.filter((_, i) => i !== index));
  };

  // 更新指定規格欄位
  const handleSkuChange = (index, field, value) => {
    const updatedSkus = [...skus];
    updatedSkus[index][field] = value;
    setSkus(updatedSkus);
  };

  // 提交商品上架
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setMessage('請輸入商品標題');
      return;
    }

    try {
      const payload = {
        title,
        description,
        cover_image: coverImage || 'https://via.placeholder.com/300',
        skus: skus.map(s => ({
          sku_name: s.sku_name || '單一規格',
          price: Number(s.price) || 0,
          stock: Number(s.stock) || 0,
          sku_image: s.sku_image || coverImage
        }))
      };

      const res = await api.post('/products/', payload);
      alert('商品上架成功！');
      navigate(`/products/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('請先登入賣家帳號');
        navigate('/login');
      } else {
        setMessage(err.response?.data?.detail || '商品上架失敗');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-sm shadow-sm p-6">
        <div className="flex items-center gap-2 border-b pb-4 mb-6">
          <PackagePlus className="w-6 h-6 text-shopee-primary" />
          <h1 className="text-xl font-bold text-gray-800">賣家中心 - 上架新商品</h1>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本資訊 */}
          <div className="space-y-4">
            <h2 className="font-bold text-gray-700 text-sm border-l-4 border-shopee-primary pl-2">
              基本資訊
            </h2>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">商品名稱 *</label>
              <input
                type="text"
                placeholder="例如: 韓版舒適大尺碼短袖 T 恤"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none focus:border-shopee-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">商品封面圖片網址 (URL)</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none focus:border-shopee-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">商品文案說明</label>
              <textarea
                rows="4"
                placeholder="詳細介紹您的商品特點、材質與洗滌方式..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2 text-sm outline-none focus:border-shopee-primary"
              />
            </div>
          </div>

          {/* 規格與價格庫存設定 (SKU) */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-700 text-sm border-l-4 border-shopee-primary pl-2">
                銷售資訊 (商品規格與庫存)
              </h2>
              <button
                type="button"
                onClick={handleAddSku}
                className="text-xs bg-orange-50 text-shopee-primary border border-shopee-primary px-3 py-1 rounded flex items-center gap-1 hover:bg-orange-100"
              >
                <Plus className="w-3 h-3" /> 新增規格
              </button>
            </div>

            <div className="space-y-3">
              {skus.map((sku, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded border">
                  <input
                    type="text"
                    placeholder="規格名稱 (例: 紅色, L)"
                    value={sku.sku_name}
                    onChange={(e) => handleSkuChange(index, 'sku_name', e.target.value)}
                    className="flex-1 border rounded p-1.5 text-sm bg-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="價格 ($)"
                    value={sku.price}
                    onChange={(e) => handleSkuChange(index, 'price', e.target.value)}
                    className="w-24 border rounded p-1.5 text-sm bg-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="庫存數量"
                    value={sku.stock}
                    onChange={(e) => handleSkuChange(index, 'stock', e.target.value)}
                    className="w-24 border rounded p-1.5 text-sm bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSku(index)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-shopee-primary text-white rounded text-sm font-medium hover:bg-shopee-hover transition-colors shadow-sm"
            >
              儲存並上架商品
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}