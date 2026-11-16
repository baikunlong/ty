<template>
  <div class="page-container">
    <!-- 顶部导航栏 (统一风格) -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area" @click="$router.push('/')" style="cursor: pointer;">
          <img :src="schoolLogo" alt="重庆城市管理职业大学" class="school-logo" />
          <span class="divider">|</span>
          <span class="platform-name">西部陆海新通道沿线产教供需对接平台</span>
        </div>
        <nav class="nav-links">
          <router-link to="/">返回首页</router-link>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content" v-if="companyInfo">
      <!-- 返回按钮 -->
      <div class="back-btn-wrapper" @click="goBack">
        <span class="arrow">←</span>
        <span>返回企业汇总</span>
      </div>

      <!-- 公司基本信息卡片 -->
      <div class="company-header-card">
        <div class="logo-box">
          <img 
            v-if="companyInfo.logo && !imgError"
            :src="getLogoUrl(companyInfo.logo)" 
            class="logo-img"
            @error="imgError = true"
            alt="logo"
          />
          <div 
            v-else
            class="logo-fallback" 
            :style="{ backgroundColor: getLogoColor(companyInfo.name) }"
          >
            {{ companyInfo.name ? companyInfo.name.substring(0, 1) : '企' }}
          </div>
        </div>
        
        <div class="info-box">
          <h1 class="company-name">{{ companyInfo.name }}</h1>
          <div class="tags">
            <span class="tag" v-if="companyInfo.stage">{{ companyInfo.stage }}</span>
            <span class="tag" v-else>不需要融资</span>
            <span class="tag">{{ companyInfo.industry || '其他行业' }}</span>
            <span class="tag">{{ companyInfo.scale || '规模未知' }}</span>
          </div>
          <div class="job-count-badge">
            当前在招岗位：<span>{{ companyJobs.length }}</span> 个
          </div>
        </div>
      </div>

      <!-- 在招岗位列表 -->
      <div class="job-list-section">
        <h2 class="section-title">在招职位</h2>
        
        <div class="job-list" v-if="companyJobs.length > 0">
          <div 
            v-for="job in companyJobs" 
            :key="job.job_id" 
            class="job-card"
            @click="openJobModal(job)"
          >
            <div class="job-main">
              <h3 class="job-title">{{ job.title }}</h3>
              <div class="job-meta">
                <span class="salary">{{ job.salary }}</span>
                <span class="divider">|</span>
                <span>{{ job.require_edu_level || '学历不限' }}</span>
                <span class="divider">|</span>
                <span>{{ job.require_work_years || '经验不限' }}</span>
                <span class="divider">|</span>
                <span>发布于 {{ formatDate(job.up_date) }}</span>
              </div>
            </div>
            <div class="job-action">
              <!-- 改为纯按钮样式，点击事件由外层卡片接管 -->
              <div class="detail-btn">查看详情</div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-tip">
          该公司暂无在招岗位
        </div>
      </div>
    </main>
    
    <!-- 兜底无数据状态 -->
    <div v-else class="not-found">
      <p>未找到该公司的信息</p>
      <router-link to="/companies" class="back-btn">返回企业汇总</router-link>
    </div>

    <!-- ================= 岗位详情弹框 ================= -->
    <div v-if="selectedJob" class="modal-overlay" @click.self="closeJobModal">
      <div class="modal-content job-detail-modal">
        <button class="close-btn" @click="closeJobModal">×</button>
        
        <div class="job-modal-header">
          <h2 class="job-modal-title">{{ selectedJob.title }}</h2>
          <div class="job-modal-salary">{{ selectedJob.salary }}</div>
        </div>
        
        <div class="job-modal-meta">
          <span class="tag edu">{{ selectedJob.require_edu_level || '学历不限' }}</span>
          <span class="tag">{{ selectedJob.require_work_years || '经验不限' }}</span>
          <span class="divider"></span>
          <span class="company-name">{{ selectedJob.comp_name }}</span>
          <span class="divider"></span>
          <span class="date">发布于 {{ formatDate(selectedJob.up_date) }}</span>
        </div>

        <div class="job-modal-body">
          <h3>岗位职责 / 需求描述</h3>
          <div class="desc-text">{{ selectedJob.ld2_description || '暂无详细描述' }}</div>
          
          <h3>联系方式与地址</h3>
          <div class="contact-box">
            <p><strong>联系人：</strong>{{ selectedJob.recruiter_name }} ({{ selectedJob.recruiter_title }})</p>
            <p><strong>工作地点：</strong>{{ selectedJob.street_address || selectedJob.address_locality }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 (统一风格) -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <img :src="schoolLogo" alt="重庆城市管理职业大学" class="footer-logo" />
          <span class="footer-school-name">重庆城市管理职业大学</span>
        </div>
        <div class="footer-right">
          <p>主办：重庆城市管理职业大学 · 产教融合项目组</p>
          <p>平台定位：西部陆海新通道沿线产教供需枢纽</p>
        </div>
      </div>
      <div class="footer-copyright">
        © 2026 西部陆海新通道沿线产教供需对接平台
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jobData from '../data/jobData.json'
// 引入学校 Logo
import schoolLogo from '../assets/logoB.png'

const route = useRoute()
const router = useRouter()

// 获取路由参数中的公司名称
const companyName = decodeURIComponent(String(route.params.name || ''))
const imgError = ref(false)

// 弹框状态
const selectedJob = ref<any>(null)

const openJobModal = (job: any) => {
  selectedJob.value = job
  document.body.style.overflow = 'hidden' // 防止背景滚动
}

const closeJobModal = () => {
  selectedJob.value = null
  document.body.style.overflow = 'auto'
}

// 提取该公司的所有岗位
const companyJobs = computed(() => {
  if (!Array.isArray(jobData)) return []
  return jobData.filter(job => job.comp_name === companyName)
})

// 提取公司基本信息（取第一条岗位的数据）
const companyInfo = computed(() => {
  if (companyJobs.value.length === 0) return null
  const firstJob = companyJobs.value[0]
  return {
    name: firstJob.comp_name,
    logo: firstJob.comp_logo,
    stage: firstJob.comp_stage,
    industry: firstJob.comp_industry,
    scale: firstJob.comp_scale
  }
})

// 智能返回
const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/companies')
  }
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

// 图片与颜色处理
const getLogoUrl = (logoName: string) => {
  try {
    return new URL(`../assets/img/${logoName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}

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
  flex-shrink: 0;
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
.nav-links a { color: #cbd5e1; font-size: 15px; text-decoration: none; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.router-link-active { color: white; font-weight: 500; }

/* ================= 主体内容 ================= */
.main-content { flex: 1; max-width: 1200px; margin: 0 auto; padding: 30px 20px 60px; width: 100%; }

/* 返回按钮 */
.back-btn-wrapper { 
  display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; 
  padding: 8px 16px; background-color: white; color: #475569; font-size: 14px; 
  font-weight: 500; border-radius: 20px; border: 1px solid #e2e8f0; 
  cursor: pointer; transition: all 0.3s; 
}
.back-btn-wrapper:hover { 
  color: #2563eb; border-color: #bfdbfe; background-color: #eff6ff; transform: translateX(-4px); 
}

/* 公司头部卡片 */
.company-header-card {
  background: white; border-radius: 12px; padding: 30px;
  display: flex; align-items: center; gap: 24px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb; margin-bottom: 30px;
}
.logo-box {
  width: 80px; height: 80px; border-radius: 12px; overflow: hidden;
  border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.logo-img { width: 100%; height: 100%; object-fit: contain; }
.logo-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: white; }

.info-box { flex: 1; }
.company-name { font-size: 24px; color: #1e293b; margin: 0 0 12px 0; font-weight: bold; }
.tags { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.tag { background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 6px; font-size: 13px; }
.job-count-badge { font-size: 14px; color: #64748b; }
.job-count-badge span { color: #2563eb; font-weight: bold; font-size: 16px; }

/* ================= 岗位列表 ================= */
.job-list-section { background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb; }
.section-title { font-size: 18px; color: #1e293b; margin: 0 0 20px 0; border-left: 4px solid #2563eb; padding-left: 12px; line-height: 1; }
.job-list { display: flex; flex-direction: column; gap: 16px; }

/* 单个岗位卡片（横向布局） */
.job-card {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;
  transition: all 0.2s; cursor: pointer;
}
.job-card:hover { border-color: #bfdbfe; background: #f8fafc; transform: translateX(4px); }
.job-title { font-size: 16px; color: #1e293b; margin: 0 0 10px 0; font-weight: 600; }
.job-meta { font-size: 13px; color: #64748b; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.salary { color: #ef4444; font-weight: bold; font-size: 15px; }
.divider { color: #cbd5e1; }

/* 查看详情按钮 */
.detail-btn {
  background: #eff6ff; color: #2563eb;
  padding: 8px 20px; border-radius: 6px;
  font-size: 14px; font-weight: 500; transition: all 0.2s; white-space: nowrap;
}
.job-card:hover .detail-btn { background: #2563eb; color: white; }

/* ================= 底部 ================= */
.site-footer {
  background: #0b1120; color: #e2e8f0; padding: 40px 20px 20px;
  border-top: 1px solid #1e293b; margin-top: auto;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 20px; padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-left { display: flex; align-items: center; gap: 12px; }
.footer-logo { height: 40px; width: 40px; object-fit: contain; background: white; border-radius: 50%; padding: 2px; }
.footer-school-name { font-size: 18px; font-weight: 600; color: white; letter-spacing: 1px; }
.footer-right { text-align: right; font-size: 14px; color: #94a3b8; line-height: 1.8; }
.footer-copyright { max-width: 1200px; margin: 20px auto 0; text-align: center; font-size: 13px; color: #64748b; }

/* ================= 弹框通用样式 ================= */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; width: 90%; max-width: 700px; border-radius: 12px; padding: 30px;
  position: relative; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  max-height: 85vh; animation: modalFadeIn 0.3s ease;
  display: flex; flex-direction: column;
}
@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.close-btn {
  position: absolute; top: 15px; right: 15px; background: #f1f5f9;
  border: none; width: 32px; height: 32px; border-radius: 50%;
  font-size: 20px; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10;
}
.close-btn:hover { background: #e2e8f0; color: #0f172a; }

/* ================= 岗位详情弹框专属 ================= */
.job-modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 20px; margin-bottom: 16px; padding-right: 30px;
}
.job-modal-title { font-size: 22px; color: #1e293b; margin: 0; line-height: 1.4; }
.job-modal-salary { font-size: 20px; color: #ef4444; font-weight: bold; white-space: nowrap; }

.job-modal-meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
  padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;
  font-size: 14px; color: #64748b;
}
.job-modal-meta .divider { width: 1px; height: 14px; background: #cbd5e1; }
.job-modal-meta .company-name { color: #334155; font-weight: 500; }
.job-modal-meta .tag.edu { background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-size: 12px;}

.job-modal-body {
  flex: 1; overflow-y: auto; padding-right: 10px;
}
.job-modal-body h3 {
  font-size: 16px; color: #1e293b; margin: 20px 0 12px 0;
  border-left: 4px solid #2563eb; padding-left: 10px; line-height: 1;
}
.job-modal-body h3:first-child { margin-top: 0; }

.desc-text {
  line-height: 1.8; color: #475569; white-space: pre-wrap; font-size: 14px;
}
.contact-box {
  background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-top: 10px;
}
.contact-box p { margin: 0 0 8px 0; color: #475569; font-size: 14px; }
.contact-box p:last-child { margin-bottom: 0; }

/* 兜底与空状态 */
.empty-tip { text-align: center; color: #94a3b8; padding: 40px 0; }
.not-found { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f4f5f7; color: #64748b; flex: 1; }
.back-btn { background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
</style>