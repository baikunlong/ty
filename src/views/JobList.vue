<template>
  <div class="page-container">
    <!-- 顶部导航 (统一风格) -->
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
    <main class="main-content">
      <!-- 页面标题与搜索 -->
      <div class="page-title-bar">
        <h1 class="page-title">全部岗位需求</h1>
        <p class="page-subtitle">汇聚优质企业，助力精准就业</p>
        <div class="search-wrapper">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索岗位标题 / 企业名称" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 筛选面板 -->
      <div class="filter-panel">
        <div class="filter-row">
          <span class="filter-label">专业方向：</span>
          <div class="filter-tabs">
            <span 
              v-for="major in filterMajors" 
              :key="major.value"
              :class="['tab', { active: selectedMajor === major.value }]"
              @click="selectMajor(major.value)"
            >
              {{ major.label }}
            </span>
          </div>
        </div>

        <div class="filter-divider"></div>

        <div class="filter-row">
          <span class="filter-label">其他条件：</span>
          <select v-model="selectedEdu" @change="handleSearch" class="filter-select">
            <option value="">学历要求</option>
            <option value="大专">大专</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士及以上</option>
          </select>
          <select v-model="selectedExp" @change="handleSearch" class="filter-select">
            <option value="">工作经验</option>
            <option value="不限">经验不限</option>
            <option value="1-3年">1-3年</option>
            <option value="3-5年">3-5年</option>
            <option value="5年以上">5年以上</option>
          </select>
          <span class="reset-btn" @click="resetFilters">清空条件</span>
        </div>
      </div>

      <!-- 岗位列表 -->
      <div class="job-grid" v-if="paginatedJobs.length > 0">
        <div v-for="job in paginatedJobs" :key="job.job_id" class="job-card">
          <div class="card-top">
            <h3 class="job-title">{{ job.title }}</h3>
            <div class="salary">{{ job.salary }}</div>
          </div>
          <div class="tags">
            <span class="tag edu">{{ job.require_edu_level || '学历不限' }}</span>
            <span class="tag">{{ job.require_work_years || '经验不限' }}</span>
          </div>
          <p class="job-desc">{{ job.ld2_description || '暂无详细描述' }}</p>
          
          <div class="job-company">
            <img v-if="job.comp_logo" :src="getLogoUrl(job.comp_logo)" class="mini-logo" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"/>
            <span class="comp-name">{{ job.comp_name }}</span>
          </div>
          <!-- 注意这里：在全部列表页，点击卡片直接进入详情页 -->
          <router-link :to="`/job/${job.job_id}`" class="card-link"></router-link>
        </div>
      </div>
      <div v-else class="empty-tip">暂无符合条件的招聘信息</div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="filteredJobs.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredJobs.length"
          layout="total, prev, pager, next"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </main>

    <!-- 底部 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <img :src="schoolLogo" alt="重庆城市管理职业大学" class="footer-logo" />
          <span class="footer-school-name">重庆城市管理职业大学</span>
        </div>
        <div class="footer-right">
          <p>主办：重庆城市管理职业大学 · 产教融合项目组</p>
          <p>平台定位：西部陆海新通道沿线产教供需对接枢纽</p>
        </div>
      </div>
      <div class="footer-copyright">© 2026 西部陆海新通道沿线产教供需对接平台</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import jobData from '../data/jobData.json'
import schoolLogo from '../assets/logoB.png'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const selectedMajor = ref('全部')
const selectedEdu = ref('')
const selectedExp = ref('')

const filterMajors = [
  { label: '全部', value: '全部', keywords: [] },
  { label: '现代物流管理', value: '现代物流管理', keywords: ['物流', '仓储', '运输', '货运', '供应链'] },
  { label: '跨境电子商务', value: '跨境电子商务', keywords: ['跨境', '电商', '外贸', '运营'] },
  { label: '关务与外贸服务', value: '关务与外贸服务', keywords: ['关务', '报关', '报检', '国际'] },
  { label: '金融服务与管理', value: '金融服务与管理', keywords: ['金融', '财务', '会计', '投资'] }
]

const filteredJobs = computed(() => {
  return jobData.filter(job => {
    let matchKeyword = true
    if (searchKeyword.value.trim()) {
      const kw = searchKeyword.value.toLowerCase().trim()
      matchKeyword = !!(
        (job.title && job.title.toLowerCase().includes(kw)) ||
        (job.comp_name && job.comp_name.toLowerCase().includes(kw))
      )
    }
    let matchMajor = true
    if (selectedMajor.value !== '全部') {
      const currentMajor = filterMajors.find(m => m.value === selectedMajor.value)
      if (currentMajor) {
        const textToSearch = `${job.title} ${job.ld2_description} ${job.comp_industry}`.toLowerCase()
        matchMajor = currentMajor.keywords.some(kw => textToSearch.includes(kw.toLowerCase()))
      }
    }
    let matchEdu = true
    if (selectedEdu.value) {
      matchEdu = !!(job.require_edu_level && job.require_edu_level.includes(selectedEdu.value))
    }
    let matchExp = true
    if (selectedExp.value) {
      matchExp = !!(job.require_work_years && job.require_work_years.includes(selectedExp.value))
    }
    return matchKeyword && matchMajor && matchEdu && matchExp
  })
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredJobs.value.slice(start, start + pageSize.value)
})

const selectMajor = (val: string) => { selectedMajor.value = val; handleSearch() }
const handleSearch = () => { currentPage.value = 1 }
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const resetFilters = () => {
  searchKeyword.value = ''
  selectedMajor.value = '全部'
  selectedEdu.value = ''
  selectedExp.value = ''
  handleSearch()
}

const getLogoUrl = (logoName: string) => {
  try { return new URL(`../assets/img/${logoName}`, import.meta.url).href } catch (e) { return '' }
}
</script>

<style scoped>
/* 基础布局 */
.page-container {
  min-height: 100vh; display: flex; flex-direction: column;
  background-color: #f4f5f7; font-family: -apple-system, sans-serif;
}

/* 顶部导航 */
.top-header {
  background: #0b1120; color: white; position: sticky; top: 0; z-index: 100;
  height: 64px; border-bottom: 1px solid rgba(255,255,255,0.1);
}
.header-inner {
  max-width: 1200px; margin: 0 auto; height: 100%;
  display: flex; justify-content: space-between; align-items: center; padding: 0 20px;
}
.logo-area { display: flex; align-items: center; gap: 12px; }
.school-logo { height: 32px; object-fit: contain; }
.divider { color: rgba(255,255,255,0.3); }
.platform-name { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.nav-links a { color: #cbd5e1; font-size: 15px; text-decoration: none; transition: 0.2s; }
.nav-links a:hover { color: white; }

/* 主体内容 */
.main-content { flex: 1; max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px; width: 100%; }

/* 标题与搜索 */
.page-title-bar { text-align: center; margin-bottom: 40px; }
.page-title { font-size: 32px; color: #1e293b; margin: 0 0 12px 0; font-weight: bold; }
.page-subtitle { font-size: 15px; color: #64748b; margin-bottom: 24px; }
.search-wrapper {
  display: flex; max-width: 600px; margin: 0 auto;
  background: white; border-radius: 8px; padding: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
}
.search-input { flex: 1; border: none; padding: 10px 20px; font-size: 15px; outline: none; }
.search-btn { background: #2563eb; color: white; border: none; padding: 0 30px; border-radius: 6px; cursor: pointer; }

/* 筛选面板 */
.filter-panel { background: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.filter-row + .filter-row { margin-top: 16px; }
.filter-label { font-size: 14px; color: #64748b; font-weight: 500; }
.filter-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.tab { padding: 6px 16px; background: #f8fafc; border-radius: 6px; cursor: pointer; font-size: 14px; color: #475569; transition: 0.2s; }
.tab:hover { background: #eff6ff; color: #2563eb; }
.tab.active { background: #2563eb; color: white; font-weight: 500; }
.filter-divider { height: 1px; background: #f1f5f9; margin: 16px 0; }
.filter-select { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; outline: none; }
.reset-btn { font-size: 13px; color: #94a3b8; cursor: pointer; margin-left: auto; }
.reset-btn:hover { color: #ef4444; }

/* 岗位网格 */
.job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.job-card {
  position: relative; background: white; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 24px; transition: 0.2s; display: flex; flex-direction: column;
}
.job-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.08); border-color: #bfdbfe; }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 10px; }
.job-title { font-size: 18px; color: #1e293b; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.salary { font-size: 16px; color: #ef4444; font-weight: bold; white-space: nowrap; }

.tags { display: flex; gap: 8px; margin-bottom: 16px; }
.tag { font-size: 12px; padding: 4px 10px; border-radius: 4px; background: #f1f5f9; color: #64748b; }
.tag.edu { background: #eff6ff; color: #2563eb; }
.job-desc {
  font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 20px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.job-company { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-top: auto; border-top: 1px dashed #e2e8f0; padding-top: 16px; }
.mini-logo { width: 20px; height: 20px; border-radius: 4px; object-fit: contain; }
.card-link { position: absolute; inset: 0; z-index: 10; }

/* 分页与空状态 */
.empty-tip { text-align: center; color: #94a3b8; padding: 60px 0; font-size: 16px; }
.pagination-wrapper { display: flex; justify-content: center; margin-top: 50px; }
:deep(.el-pagination.is-background .el-pager li.is-active) { background-color: #2563eb; }

/* 底部 */
.site-footer { background: #0b1120; color: #e2e8f0; padding: 40px 20px 20px; border-top: 1px solid #1e293b; margin-top: auto; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.footer-left { display: flex; align-items: center; gap: 12px; }
.footer-logo { height: 40px; width: 40px; object-fit: contain; background: white; border-radius: 50%; padding: 2px; }
.footer-school-name { font-size: 18px; font-weight: 600; color: white; }
.footer-right { text-align: right; font-size: 14px; color: #94a3b8; line-height: 1.8; }
.footer-copyright { max-width: 1200px; margin: 20px auto 0; text-align: center; font-size: 13px; color: #64748b; }
</style>