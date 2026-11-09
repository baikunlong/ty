<template>
  <div class="page-container" v-if="job">
    <!-- 顶部 Banner 与 导航栏 -->
    <header class="banner-header detail-header">
      <div class="bg-grid"></div>
      <div class="top-nav">
        <div class="nav-inner">
          <div class="nav-logo">国际物流产教融合数据平台</div>
          <div class="nav-links">
            <router-link to="/" class="active">供需大厅</router-link>
            <router-link to="/companies">企业汇总</router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <main class="main-content">
      <div class="detail-wrapper">
        <!-- 返回按钮 -->
        <router-link to="/" class="back-link">
          <span class="arrow">&lt;</span> 返回岗位列表
        </router-link>

        <!-- 详情大卡片 -->
        <div class="detail-card">
          <div class="detail-title-row">
            <h1 class="title">{{ job.title }}</h1>
            <div class="salary">{{ job.salary }}</div>
          </div>
          
          <!-- 元信息区域 (包含新增的 Logo) -->
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
  </div>
  
  <!-- 数据找不到时的兜底 -->
  <div v-else class="not-found">
    <div class="empty-icon">📭</div>
    <p>未找到该岗位信息，可能已下线。</p>
    <router-link to="/" class="back-btn">返回列表</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import jobData from '../data/jobData.json'

const route = useRoute()
const jobId = String(route.params.id)
// 控制 Logo 加载失败的响应式变量
const imgError = ref(false)

// 从数据中查找对应的岗位
const job = computed(() => {
  return jobData.find(j => j.job_id === jobId)
})

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
}

/* ================= 头部 ================= */
.banner-header {
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.detail-header {
  padding-bottom: 0; 
}
.bg-grid {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  pointer-events: none;
}
.top-nav {
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-logo { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: #fff; font-weight: 500; }

/* ================= 主体内容 ================= */
.main-content {
  flex: 1;
  width: 100%;
  padding: 30px 20px;
}
.detail-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 返回按钮 */
.back-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  margin-left: 20px;
}
.back-link .arrow {
  font-size: 16px;
  margin-right: 6px;
  font-weight: bold;
}
.back-link:hover { color: #2563eb; }

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
.title {
  font-size: 28px;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}
.salary {
  font-size: 24px;
  color: #ef4444;
  font-weight: bold;
  white-space: nowrap;
}

/* ================= 元信息区域 (Logo 样式在这里) ================= */
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

/* 公司组 (Logo + 文字) */
.company-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 小 Logo 包裹层 */
.mini-logo-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 小图片 */
.mini-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 小兜底色块 */
.mini-logo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.company { 
  color: #334155; 
  font-weight: 500; 
  font-size: 15px; /* 稍微放大一点公司名 */
}

/* 内容区块 */
.content-section {
  margin-top: 35px;
}
.content-section h3 {
  font-size: 18px;
  color: #1e293b;
  margin: 0 0 16px 0;
  font-weight: 600;
  border-left: 4px solid #2563eb;
  padding-left: 12px;
  line-height: 1;
}
.desc-text {
  line-height: 1.8;
  color: #475569;
  white-space: pre-wrap;
  font-size: 15px;
}

/* 联系方式小框 */
.contact-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}
.contact-box p {
  margin: 0 0 10px 0;
  color: #475569;
  font-size: 14px;
}
.contact-box p:last-child { margin-bottom: 0; }

/* ================= 兜底空状态 =========== */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f5f7;
  color: #64748b;
}
.not-found .empty-icon { font-size: 60px; margin-bottom: 20px; opacity: 0.6; }
.not-found p { font-size: 18px; margin-bottom: 20px; }
.back-btn {
  background: #2563eb;
  color: white;
  padding: 10px 24px;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
}
.back-btn:hover { background: #1d4ed8; }
</style>