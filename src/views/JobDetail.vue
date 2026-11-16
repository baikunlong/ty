<template>
  <div class="page-container" v-if="job">
    <!-- 顶部导航栏 (纯净版：Logo + 返回首页) -->
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

    <!-- 主体内容区域 -->
    <main class="main-content">
      <div class="detail-wrapper">
        <!-- 智能返回按钮 -->
        <!-- <div class="back-btn-wrapper" @click="goBack">
          <span class="arrow">←</span>
          <span>返回上页</span>
        </div> -->

        <!-- 详情大卡片 -->
        <div class="detail-card">
          <div class="detail-title-row">
            <h1 class="title">{{ job.title }}</h1>
            <div class="salary">{{ job.salary }}</div>
          </div>
          
          <!-- 元信息区域 -->
          <div class="meta-info">
            <span class="tag blue-tag">{{ job.require_edu_level || '学历不限' }}</span>
            <span class="tag orange-tag">{{ job.require_work_years || '经验不限' }}</span>
            <span class="divider"></span>
            
            <!-- 公司信息 (Logo + 名称) -->
            <div class="company-group">
              <div class="mini-logo-wrapper">
                <img 
                  v-if="job.comp_logo && !imgError"
                  :src="getLogoUrl(job.comp_logo)" 
                  class="mini-logo-img"
                  @error="imgError = true"
                  alt="logo"
                />
                <div 
                  v-else 
                  class="mini-logo-fallback"
                  :style="{ backgroundColor: getLogoColor(job.comp_name) }"
                >
                  {{ job.comp_name ? job.comp_name.substring(0, 1) : '企' }}
                </div>
              </div>
              <span class="company">{{ job.comp_name }}</span>
            </div>

            <span class="divider"></span>
            <span class="date">发布时间：{{ formatDate(job.pub_date || job.up_date) }}</span>
          </div>

          <div class="content-section">
            <h3>岗位职责 / 需求描述</h3>
            <div class="desc-text">
              {{ job.ld2_description || '暂无详细描述' }}
            </div>
          </div>

          <div class="content-section">
            <h3>联系方式与地址</h3>
            <div class="contact-box">
              <p><strong>联系人：</strong>{{ job.recruiter_name }} ({{ job.recruiter_title }})</p>
              <p><strong>工作地点：</strong>{{ job.street_address || job.address_locality }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部 -->
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
  </div>
  
  <!-- 数据找不到时的兜底 -->
  <div v-else class="not-found">
    <div class="empty-icon">📭</div>
    <p>未找到该岗位信息，可能已下线。</p>
    <router-link to="/" class="back-btn">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jobData from '../data/jobData.json'
// 引入学校 Logo (变量名为 logoB，与用户要求一致)
import logoB from '../assets/logoB.png'

const route = useRoute()
const router = useRouter()
const jobId = String(route.params.id)
const imgError = ref(false)

// 从数据中查找对应的岗位
const job = computed(() => {
  return jobData.find(j => j.job_id === jobId)
})

// 智能返回
const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

// 图片路径处理
const getLogoUrl = (logoName: string) => {
  try {
    return new URL(`../assets/img/${logoName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}

// 兜底颜色
const getLogoColor = (name: string) => {
  if (!name) return '#94a3b8'
  const colors = ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
/* ================= 基础布局 ================= */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ================= 顶部导航 ================= */
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
.nav-links { display: flex; gap: 32px; }
.nav-links a { 
  color: #cbd5e1; 
  font-size: 15px; 
  text-decoration: none; 
  transition: color 0.2s; 
}
.nav-links a:hover, .nav-links a.router-link-active { color: white; font-weight: 500; }

/* ================= 主体内容 ================= */
.main-content {
  flex: 1;
  width: 100%;
  padding: 30px 20px;
}
.detail-wrapper {
  max-width: 1200px; /* 详情页限制 900px 更适合阅读 */
  margin: 0 auto;
}

/* 新版返回按钮 */
.back-btn-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  padding: 8px 16px;
  background-color: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.back-btn-wrapper:hover {
  color: #2563eb;
  border-color: #bfdbfe;
  background-color: #eff6ff;
  transform: translateX(-4px);
}
.back-btn-wrapper .arrow { font-size: 16px; font-weight: bold; }

/* 详情卡片 */
.detail-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
}
.detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}
.title { font-size: 28px; color: #1e293b; margin: 0; line-height: 1.4; }
.salary { font-size: 24px; color: #ef4444; font-weight: bold; white-space: nowrap; }

/* 元信息区域 */
.meta-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #64748b;
}
.tag { padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
.blue-tag { background: #eff6ff; color: #2563eb; }
.orange-tag { background: #fff7ed; color: #ea580c; }
.divider { width: 1px; height: 14px; background: #cbd5e1; margin: 0 4px; }

.company-group { display: inline-flex; align-items: center; gap: 8px; }
.mini-logo-wrapper {
  width: 24px; height: 24px; border-radius: 4px; overflow: hidden;
  border: 1px solid #e2e8f0; background: white;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mini-logo-img { width: 100%; height: 100%; object-fit: contain; }
.mini-logo-fallback {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  color: white; font-size: 12px; font-weight: bold;
}
.company { color: #334155; font-weight: 500; font-size: 15px; }

/* 内容区块 */
.content-section { margin-top: 35px; }
.content-section h3 {
  font-size: 18px; color: #1e293b; margin: 0 0 16px 0; font-weight: 600;
  border-left: 4px solid #2563eb; padding-left: 12px; line-height: 1;
}
.desc-text {
  line-height: 1.8; color: #475569; white-space: pre-wrap; font-size: 15px;
}
.contact-box {
  background: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;
}
.contact-box p { margin: 0 0 10px 0; color: #475569; font-size: 14px; }
.contact-box p:last-child { margin-bottom: 0; }

/* ================= 底部 ================= */
.site-footer {
  background: #0b1120;
  color: #e2e8f0;
  padding: 40px 20px 20px;
  border-top: 1px solid #1e293b;
  margin-top: auto;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 20px; padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-left { display: flex; align-items: center; gap: 12px; }
.footer-logo {
  height: 40px; width: 40px; object-fit: contain;
  background: white; border-radius: 50%; padding: 2px;
}
.footer-school-name { font-size: 18px; font-weight: 600; color: white; letter-spacing: 1px; }
.footer-right { text-align: right; font-size: 14px; color: #94a3b8; line-height: 1.8; }
.footer-copyright {
  max-width: 1200px; margin: 20px auto 0;
  text-align: center; font-size: 13px; color: #64748b;
}

/* 兜底空状态 */
.not-found {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  background-color: #f4f5f7; color: #64748b;
}
.not-found .empty-icon { font-size: 60px; margin-bottom: 20px; opacity: 0.6; }
.not-found p { font-size: 18px; margin-bottom: 20px; }
.back-btn {
  background: #2563eb; color: white; padding: 10px 24px;
  border-radius: 6px; text-decoration: none; transition: background 0.2s;
}
.back-btn:hover { background: #1d4ed8; }
</style>