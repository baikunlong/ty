<template>
  <div class="page-container">
    <!-- 顶部导航栏 (统一风格) -->
    <header class="top-header">
      <div class="header-inner">
        <!-- 点击 Logo 回到首页 -->
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

    <!-- 主体内容区 -->
    <main class="main-content">
      <!-- 页面标题区 -->
      <div class="page-title-bar">
        <h1 class="page-title">合作企业汇总</h1>
        <p class="page-subtitle">汇聚优质企业，助力精准就业</p>
      </div>

      <div class="empty-tip" v-if="companies.length === 0">
        暂无企业信息
      </div>

      <div class="grid-container">
        <!-- 遍历去重后的公司数据 -->
        <div 
          class="company-card" 
          v-for="company in paginatedCompanies" 
          :key="company.name"
          @click="goToCompany(company.name)"
        >
          <!-- 卡片上半部分：公司信息 -->
          <div class="card-top">
            <!-- Logo 读取 -->
            <div class="company-logo-wrapper">
              <img 
                v-if="company.logo && !imgErrorMap[company.name]"
                :src="getLogoUrl(company.logo)" 
                class="company-logo-img"
                @error="handleImgError(company.name)"
                alt="logo"
              />
              <div 
                v-else
                class="company-logo-fallback" 
                :style="{ backgroundColor: getLogoColor(company.name) }"
              >
                {{ company.name ? company.name.substring(0, 1) : '企' }}
              </div>
            </div>
            
            <div class="company-info">
              <div class="company-name" :title="company.name">{{ company.name }}</div>
              <div class="company-tags">
                <span class="tag" v-if="company.stage">{{ company.stage }}</span>
                <span class="tag" v-else>不需要融资</span>
                <span class="tag">{{ company.industry || '其他行业' }}</span>
              </div>
            </div>
          </div>
          
          <!-- 卡片下半部分：统计信息 -->
          <div class="card-bottom">
            <span class="hot-tag">在招</span>
            <span class="job-count-text">
              共 <strong>{{ company.jobCount }}</strong> 个岗位
            </span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="companies.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="companies.length"
          layout="total, prev, pager, next"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </main>

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
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import jobData from '../data/jobData.json'
// 引入学校 Logo
import schoolLogo from '../assets/logoB.png'

const router = useRouter()
const currentPage = ref(1)
const pageSize = 15 

// 记录图片加载失败的 Map
const imgErrorMap = reactive<Record<string, boolean>>({})

// 🌟 核心逻辑：将扁平化的岗位数据，聚合成独立的公司数据
const companies = computed(() => {
  if (!Array.isArray(jobData)) return []
  
  const companyMap = new Map()

  jobData.forEach(job => {
    const name = job.comp_name
    if (!name) return

    if (companyMap.has(name)) {
      // 如果公司已存在，岗位数 +1
      companyMap.get(name).jobCount += 1
    } else {
      // 如果公司不存在，初始化信息
      companyMap.set(name, {
        name: name,
        logo: job.comp_logo,
        stage: job.comp_stage,
        industry: job.comp_industry,
        jobCount: 1 // 初始岗位数为 1
      })
    }
  })

  // 将 Map 转为数组，并按照在招岗位数量降序排列
  return Array.from(companyMap.values()).sort((a: any, b: any) => b.jobCount - a.jobCount)
})

// 分页逻辑
const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return companies.value.slice(start, start + pageSize)
})

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 跳转到公司详情
const goToCompany = (name: string) => {
  router.push(`/company/${encodeURIComponent(name)}`)
}

// 图片路径处理
const getLogoUrl = (logoName: string) => {
  try {
    return new URL(`../assets/img/${logoName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}

const handleImgError = (companyName: string) => {
  imgErrorMap[companyName] = true
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
  background-color: #f4f5f7;
  display: flex;
  flex-direction: column;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  width: 100%;
}

/* 页面标题 */
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

/* ================= 公司卡片网格 ================= */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.company-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}
.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08);
  border-color: #bfdbfe;
}

/* 卡片上半部 */
.card-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.company-logo-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-logo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.company-info {
  flex: 1;
  overflow: hidden;
}
.company-name {
  font-size: 16px;
  text-align: left;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.company-tags {
  display: flex;
  gap: 8px;
}
.tag {
  font-size: 12px;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

/* 卡片下半部 */
.card-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 16px;
  margin-top: auto;
}
.hot-tag {
  color: #2563eb;
  font-size: 12px;
  background-color: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 500;
}
.job-count-text {
  font-size: 14px;
  color: #64748b;
}
.job-count-text strong {
  color: #2563eb;
  font-size: 16px;
  margin: 0 2px;
}

/* ================= 分页与状态 ================= */
.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 16px;
}
.pagination-container { 
  display: flex; 
  justify-content: center; 
  margin-top: 50px; 
  padding-bottom: 20px; 
}
:deep(.el-pagination.is-background .el-pager li.is-active) { 
  background-color: #2563eb; 
}
:deep(.el-pagination.is-background .el-pager li:hover) { 
  color: #2563eb; 
}

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
</style>