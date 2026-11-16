<template>
  <div class="news-page-container">
    <!-- 顶部导航栏 (与首页完全一致) -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area" @click="$router.push('/')" style="cursor: pointer;">
          <img :src="logoB" alt="重庆城市管理职业大学" class="school-logo" />
          <span class="divider">|</span>
          <span class="platform-name">西部陆海新通道沿线产教供需对接平台</span>
        </div>
        <nav class="nav-links">
          <router-link to="/">返回首页</router-link>
        </nav>
      </div>
    </header>

    <!-- 主体列表 -->
    <main class="news-main">
      <div class="page-title-bar">
        <h1 class="page-title">全部政策新闻</h1>
        <p class="page-subtitle">汇聚西部陆海新通道最新政策动态与行业资讯</p>
      </div>

      <div class="news-grid">
        <div class="news-card" v-for="news in newsList" :key="news.id" @click="openNewsModal(news)">
          <h3 class="news-title">{{ news.news_title }}</h3>
          <p class="news-summary">{{ news.news_summary }}</p>
          <div class="news-footer">
            <span class="platform">{{ news.publish_platform }}</span>
            <span class="date">{{ news.publish_time }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部 (与首页完全一致) -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <img :src="logoB" alt="重庆城市管理职业大学" class="footer-logo" />
          <span class="footer-school-name">重庆城市管理职业大学</span>
        </div>
        <div class="footer-right">
          <p>主办：重庆城市管理职业大学 · 产教融合项目组</p>
          <p>平台定位：西部陆海新通道沿线产教供需对接枢纽</p>
        </div>
      </div>
      <div class="footer-copyright">
        © 2026 西部陆海新通道沿线产教供需对接平台
      </div>
    </footer>

    <!-- 新闻详情弹框 (与首页一致) -->
    <div v-if="selectedNews" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <h2 class="modal-title">{{ selectedNews.news_title }}</h2>
        <div class="modal-meta">
          <span>来源：{{ selectedNews.publish_platform }}</span>
          <span>发布时间：{{ selectedNews.publish_time }}</span>
        </div>
        <div class="modal-body">
          <p>{{ selectedNews.news_summary }}</p>
        </div>
        <div class="modal-footer">
          <a :href="selectedNews.source_url" target="_blank" class="source-link">阅读原文链接 →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import newsData from '../data/channel_policy_news.json'
// 引入学校的 Logo (请确保路径正确)
import logoB from '../assets/logoB.png'

const newsList = ref(newsData)
const selectedNews = ref<any>(null)

const openNewsModal = (news: any) => {
  selectedNews.value = news
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedNews.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
/* ================= 基础布局 ================= */
.news-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ================= 顶部导航 (复用首页) ================= */
.top-header {
  background: #0b1120;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.logo-area { display: flex; align-items: center; gap: 12px; }
.school-logo { height: 32px; object-fit: contain; }
.divider { color: rgba(255,255,255,0.3); }
.platform-name { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.nav-links a { color: #cbd5e1; font-size: 15px; text-decoration: none; transition: color 0.2s; }
.nav-links a:hover { color: white; }

/* ================= 主体内容 ================= */
.news-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  width: 100%;
}
.page-title-bar {
  text-align: center;
  margin-bottom: 40px;
}
.page-title {
  font-size: 32px;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-weight: bold;
  letter-spacing: 2px;
}
.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}
.news-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.08);
  border-color: #bfdbfe;
}
.news-title {
  font-size: 18px;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-summary {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.news-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
  border-top: 1px dashed #e2e8f0;
  padding-top: 16px;
  margin-top: auto;
}

/* ================= 底部 (复用首页) ================= */
.site-footer {
  background: #0b1120;
  color: #e2e8f0;
  padding: 40px 20px 20px;
  border-top: 1px solid #1e293b;
  margin-top: auto;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-left { display: flex; align-items: center; gap: 12px; }
.footer-logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
  background: white;
  border-radius: 50%;
  padding: 2px;
}
.footer-school-name { font-size: 18px; font-weight: 600; color: white; letter-spacing: 1px; }
.footer-right { text-align: right; font-size: 14px; color: #94a3b8; line-height: 1.8; }
.footer-copyright {
  max-width: 1200px;
  margin: 20px auto 0;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

/* ================= 弹框样式 ================= */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  width: 90%;
  max-width: 700px;
  border-radius: 12px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  max-height: 80vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}
@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.close-btn {
  position: absolute;
  top: 15px; right: 15px;
  background: #f1f5f9;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover { background: #e2e8f0; color: #0f172a; }
.modal-title {
  font-size: 22px;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-right: 30px;
  line-height: 1.4;
}
.modal-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #64748b;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}
.modal-body {
  font-size: 15px;
  color: #334155;
  line-height: 1.8;
}
.modal-footer {
  margin-top: 30px;
  text-align: right;
}
.source-link {
  color: #2563eb;
  font-weight: 500;
  font-size: 14px;
}
.source-link:hover { text-decoration: underline; }
</style>