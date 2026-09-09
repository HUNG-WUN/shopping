<h1>shopping 🛒💳</h1>

<p>A full-stack e-commerce web platform built with Python FastAPI, featuring user authentication, product catalog management, and credit card payment integration.</p>

<p>
  <a href="https://github.com/HUNG-WUN/shopping"><img src="https://img.shields.io/badge/GitHub-Repository-blue?logo=github" alt="GitHub Repo"></a>
  <img src="https://img.shields.io/badge/Python-3.9+-green?logo=python" alt="Python Version">
  <img src="https://img.shields.io/badge/FastAPI-0.95+-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/SQLite3-Database-lightgrey?logo=sqlite" alt="SQLite3">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

<hr>

<h2>📌 專案簡介 (Overview)</h2>
<p><b>shopping</b> 是一個結合現代化 Web API 與資料庫設計的電商購物平台專案。本專案採用 Python FastAPI 框架建構高吞吐量的後端服務，支援完整的會員註冊登入、商品上架與瀏覽、購物車金流處理解析，以及信用卡線上支付介面串接。</p>

<hr>

<h2>✨ 核心功能 (Key Features)</h2>
<ul>
  <li>👤 <b>會員管理系統 (User Management)</b>：安全的會員註冊、登入驗證與密碼雜湊加密保存。</li>
  <li>🛍️ <b>商品目錄與購物車 (Catalog & Cart)</b>：商品列表展示、分類篩選、動態加入與管理購物車品項。</li>
  <li>💳 <b>金流支付整合 (Credit Card Payment)</b>：信用卡支付流程處理與交易狀態即時回應。</li>
  <li>⚡ <b>連線池與高效存取 (Database Connection Pool)</b>：後端整合資料庫連線池機制，優化併發查詢效率。</li>
  <li>🚀 <b>自動化 API 文件 (OpenAPI / Swagger)</b>：內建 Swagger UI 介面，方便進行 API 端點測試與前後端對接。</li>
</ul>

<hr>

<h2>🛠️ 技術棧 (Tech Stack)</h2>

<table border="1">
  <thead>
    <tr>
      <th>領域</th>
      <th>技術 / 套件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>後端框架 (Backend)</b></td>
      <td>Python 3.9+, FastAPI, Uvicorn, Pydantic</td>
    </tr>
    <tr>
      <td><b>資料庫 (Database)</b></td>
      <td>SQLite3 / MySQL, Connection Pooling</td>
    </tr>
    <tr>
      <td><b>資安驗證 (Security)</b></td>
      <td>Passlib, OAuth2 / JWT Token</td>
    </tr>
    <tr>
      <td><b>開發環境 (Dev)</b></td>
      <td>PyCharm, Git</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>📁 專案目錄結構 (Directory Structure)</h2>

<pre><code>shopping/
├── app/                  # 應用程式核心邏輯
│   ├── api/              # API 路由與控制器 (使用者, 商品, 訂單)
│   ├── core/             # 資料庫連線池與安全設定
│   ├── models/           # Pydantic schema 與資料庫模型
│   └── main.py           # FastAPI 主入口檔案
├── static/               # 前端靜態資源 (CSS / JS / Images)
├── templates/            # HTML 頁面模板
├── requirements.txt      # Python 套件依賴清單
└── README.md             # 專案說明文件
</code></pre>

<hr>

<h2>🚀 快速開始 (Quick Start)</h2>

<h3>前置需求 (Prerequisites)</h3>
<ul>
  <li><a href="https://git-scm.com/">Git</a></li>
  <li><a href="https://www.python.org/">Python 3.9+</a></li>
</ul>

<h3>1. 克隆儲存庫 (Clone Repository)</h3>
<pre><code>git clone https://github.com/HUNG-WUN/shopping.git
cd shopping
</code></pre>

<h3>2. 建立並啟動虛擬環境 (Virtual Environment)</h3>
<pre><code>python -m venv venv

# Windows 啟動虛擬環境：
# venv\Scripts\activate

# macOS / Linux 啟動虛擬環境：
source venv/bin/activate
</code></pre>

<h3>3. 安裝依賴套件 (Install Dependencies)</h3>
<pre><code>pip install -r requirements.txt
</code></pre>

<h3>4. 啟動後端服務 (Run Application)</h3>
<pre><code>python -m uvicorn app.main:app --reload
</code></pre>

<p>💡 服務啟動後，開啟瀏覽器造訪 Swagger API 文件：<code>http://localhost:8000/docs</code></p>

<hr>

<h2>🤝 貢獻指南 (Contributing)</h2>
<p>歡迎提交 Pull Request 或開立 Issues 提出建議與改善方案！</p>
<ol>
  <li>Fork 本專案</li>
  <li>建立功能分支 (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>提交變更 (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>推送至分支 (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>開啟 Pull Request</li>
</ol>

<hr>

<h2>📜 授權條款 (License)</h2>
<p>本專案採用 <a href="LICENSE">MIT License</a> 授權條款。</p>
