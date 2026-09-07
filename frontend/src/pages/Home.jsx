import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("獲取商品失敗:", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-orange-100 to-amber-50 border border-orange-200 rounded-xl p-6 mb-7 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-shopee-primary text-xl font-bold">限時特賣 Flash Sale</h2>
          <p className="mt-1 text-base text-gray-600">每日 00:00、12:00、18:00 強勢開搶</p>
        </div>
        <span className="bg-shopee-primary text-white text-sm px-4 py-2 rounded-full font-bold shadow">每日必搶</span>
      </div>

      <div className="bg-white p-4 mb-5 rounded-xl shadow-sm border-b-2 border-shopee-primary">
        <h3 className="text-shopee-primary font-bold text-center text-xl uppercase tracking-wider">每日新發現</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product) => {
          const minPrice = product.skus?.length > 0 
            ? Math.min(...product.skus.map(s => s.price))
            : 0;

          return (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-xl overflow-hidden border border-transparent hover:border-shopee-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <img
                  src={product.cover_image || "https://via.placeholder.com/200"}
                  alt={product.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-2">
                  <h4 className="text-base text-gray-800 font-medium line-clamp-2 mb-2 group-hover:text-shopee-primary">
                    {product.title}
                  </h4>
                </div>
              </div>
              <div className="p-2 pt-0 flex justify-between items-baseline">
                <span className="text-shopee-primary text-lg font-bold">${minPrice}</span>
                <span className="text-sm text-gray-400">已售出 0</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
