<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <header class="banner-header">
      <div class="bg-grid"></div>
      <div class="top-nav">
        <div class="nav-inner">
          <div class="nav-logo">国际物流产教融合数据平台</div>
          <div class="nav-links">
            <router-link to="/JobList">供需大厅</router-link>
            <router-link to="/" class="active">企业汇总</router-link>
          </div>
        </div>
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
              <router-link :to="`/job/${job.job_id}`" class="detail-btn">查看详情</router-link>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-tip">
          该公司暂无在招岗位
        </div>
      </div>
    </main>
    
    <div v-else class="not-found">
      <p>未找到该公司的信息</p>
      <router-link to="/companies" class="back-btn">返回企业汇总</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jobData from '../data/jobData.json'

const route = useRoute()
const router = useRouter()

// 获取路由参数中的公司名称
const companyName = decodeURIComponent(String(route.params.name || ''))
const imgError = ref(false)

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
/* 基础布局与头部（完全复用之前的风格） */
.page-container { min-height: 100vh; display: flex; flex-direction: column; background-color: #f4f5f7; }
.banner-header { width: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; position: relative; overflow: hidden; flex-shrink: 0; }
.bg-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px); mask-image: radial-gradient(circle at center, black 40%, transparent 80%); -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%); pointer-events: none; }
.top-nav { position: relative; z-index: 2; border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(8px); }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; height: 60px; display: flex; justify-content: space-between; align-items: center; }
.nav-logo { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: #fff; font-weight: 500; }

.main-content { flex: 1; max-width: 1200px; margin: 0 auto; padding: 30px 20px 60px; width: 100%; }

/* 返回按钮 */
.back-btn-wrapper { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; padding: 8px 16px; background-color: white; color: #475569; font-size: 14px; font-weight: 500; border-radius: 20px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.3s; }
.back-btn-wrapper:hover { color: #2563eb; border-color: #bfdbfe; background-color: #eff6ff; transform: translateX(-4px); }

/* 公司头部卡片 */
.company-header-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 30px;
}
.logo-box {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-img { width: 100%; height: 100%; object-fit: contain; }
.logo-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: white; }

.info-box { flex: 1; }
.company-name { font-size: 24px; color: #1e293b; margin: 0 0 12px 0; font-weight: bold; }
.tags { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.tag { background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 6px; font-size: 13px; }
.job-count-badge { font-size: 14px; color: #64748b; }
.job-count-badge span { color: #2563eb; font-weight: bold; font-size: 16px; }

/* 岗位列表 */
.job-list-section { background: white; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb; }
.section-title { font-size: 18px; color: #1e293b; margin: 0 0 20px 0; border-left: 4px solid #2563eb; padding-left: 12px; line-height: 1; }
.job-list { display: flex; flex-direction: column; gap: 16px; }

/* 单个岗位卡片（横向布局） */
.job-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}
.job-card:hover { border-color: #bfdbfe; background: #f8fafc; transform: translateX(4px); }
.job-title { font-size: 16px; color: #1e293b; margin: 0 0 10px 0; font-weight: 600; }
.job-meta { font-size: 13px; color: #64748b; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.salary { color: #ef4444; font-weight: bold; font-size: 15px; }
.divider { color: #cbd5e1; }

/* 查看详情按钮 */
.detail-btn {
  background: #eff6ff;
  color: #2563eb;
  padding: 8px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}
.detail-btn:hover { background: #2563eb; color: white; }

/* 兜底与空状态 */
.empty-tip { text-align: center; color: #94a3b8; padding: 40px 0; }
.not-found { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f4f5f7; color: #64748b; }
.back-btn { background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
</style>