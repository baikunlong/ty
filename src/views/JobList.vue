<template>
  <div class="page-container">
    <!-- 顶部 Banner 区域 -->
    <header class="banner-header">
      <div class="bg-grid"></div>
      <div class="top-nav">
        <div class="nav-inner">
          <div class="nav-logo">国际物流产教融合数据平台</div>
          <div class="nav-links">
            <router-link to="/JobList" class="active">供需大厅</router-link>
            <router-link to="/">企业汇总</router-link>
          </div>
        </div>
      </div>

      <div class="banner-content">
        <div class="sub-title">MODERN LOGISTICS TALENT PLATFORM</div>
        <h1 class="main-title">供需对接信息服务平台</h1>
        <p class="desc">服务物流、跨境电商与关务机构解决人才需求，构建产教融合协同服务枢纽</p>
        
        <div class="search-wrapper">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索岗位标题 / 公司名称 / 需求描述" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <main class="main-content">
      
      <!-- 筛选面板 -->
      <div class="filter-panel">
        <div class="filter-row">
          <span class="filter-label">专业方向：</span>
          <div class="filter-tabs">
            <span 
              v-for="major in majors" 
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
          
          <el-select v-model="selectedEdu" placeholder="学历要求" clearable class="custom-select" @change="handleSearch">
            <el-option label="不限" value="" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士及以上" value="硕士" />
          </el-select>

          <el-select v-model="selectedExp" placeholder="工作经验" clearable class="custom-select" @change="handleSearch">
            <el-option label="不限" value="" />
            <el-option label="经验不限" value="不限" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="5年以上" value="5年以上" />
          </el-select>

          <el-button class="reset-btn" @click="resetFilters" :disabled="!hasActiveFilters" text>
            清空条件
          </el-button>
        </div>
      </div>

      <!-- 列表网格 -->
      <div class="job-grid" v-if="paginatedJobs.length > 0">
        <div v-for="job in paginatedJobs" :key="job.job_id" class="job-card">
          <div class="card-left">
            <div class="card-top">
              <h3 class="job-title">{{ job.title }}</h3>
              <div class="tags">
                <span class="tag major-tag">{{ job.require_edu_level || '学历不限' }}</span>
                <span class="tag">{{ job.require_work_years || '经验不限' }}</span>
              </div>
            </div>
            <div class="card-desc line-clamp-3">
              {{ job.ld2_description || '暂无详细描述' }}
            </div>
            
            <!-- 底部信息（加入了微型Logo） -->
            <div class="card-footer">
              <div class="company-info">
                <!-- 微型 Logo 开始 -->
                <div class="mini-logo-wrapper">
                  <img 
                    v-if="job.comp_logo && !imgErrorMap[job.job_id]"
                    :src="getLogoUrl(job.comp_logo)" 
                    class="mini-logo-img"
                    @error="handleImgError(job.job_id)"
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
                <!-- 微型 Logo 结束 -->
                
                <span class="company" :title="job.comp_name">{{ job.comp_name }}</span>
              </div>
              <span class="time">{{ formatDate(job.up_date) }}</span>
            </div>
          </div>
          <router-link :to="`/job/${job.job_id}`" class="card-link"></router-link>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-tip">
        <div class="empty-icon">📭</div>
        <p>暂无符合条件的招聘信息，试试清空条件</p>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container" v-if="filteredJobs.length > 0">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import jobData from '../data/jobData.json'

const route = useRoute()

// 基础状态
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(6)

// 筛选状态
const selectedMajor = ref('全部')
const selectedEdu = ref('')
const selectedExp = ref('')

// 记录图片加载失败的 Map
const imgErrorMap = reactive<Record<string, boolean>>({})

// 专业群配置
const majors = [
  { label: '全部', value: '全部', keywords: [] },
  { label: '现代物流管理', value: '现代物流管理', keywords: ['物流', '仓储', '运输', '货运', '供应链'] },
  { label: '跨境电子商务', value: '跨境电子商务', keywords: ['跨境', '电商', '外贸', '运营'] },
  { label: '关务与外贸服务', value: '关务与外贸服务', keywords: ['关务', '报关', '报检', '国际'] },
  { label: '物联网应用技术', value: '物联网应用技术', keywords: ['物联', '硬件', '设备', '传感', '自动化'] },
  { label: '金融服务与管理', value: '金融服务与管理', keywords: ['金融', '财务', '会计', '投资'] }
]

const hasActiveFilters = computed(() => {
  return searchKeyword.value || selectedMajor.value !== '全部' || selectedEdu.value || selectedExp.value
})

// 处理从其他页跳转的参数
watch(() => route.query.keyword, (newVal) => {
  if (newVal) {
    searchKeyword.value = newVal as string
    currentPage.value = 1
  }
}, { immediate: true })

// 核心过滤逻辑
const filteredJobs = computed(() => {
  if (!Array.isArray(jobData)) return []

  return jobData.filter(job => {
    // 1. 关键词搜索 (加上了 !! 强制转为 boolean)
    let matchKeyword = true
    if (searchKeyword.value.trim()) {
      const kw = searchKeyword.value.toLowerCase().trim()
      matchKeyword = !!(
        (job.title && job.title.toLowerCase().includes(kw)) ||
        (job.comp_name && job.comp_name.toLowerCase().includes(kw)) ||
        (job.ld2_description && job.ld2_description.toLowerCase().includes(kw))
      )
    }

    // 2. 专业匹配 (some 方法本身返回 boolean，不需要改)
    let matchMajor = true
    if (selectedMajor.value !== '全部') {
      const currentMajor = majors.find(m => m.value === selectedMajor.value)
      if (currentMajor) {
        const textToSearch = `${job.title} ${job.ld2_description} ${job.comp_industry}`.toLowerCase()
        matchMajor = currentMajor.keywords.some(kw => textToSearch.includes(kw.toLowerCase()))
      }
    }

    // 3. 学历匹配 
    let matchEdu = true
    if (selectedEdu.value) {
      matchEdu = !!(job.require_edu_level && job.require_edu_level.includes(selectedEdu.value))
    }

    // 4. 经验匹配 
    let matchExp = true
    if (selectedExp.value) {
      matchExp = !!(job.require_work_years && job.require_work_years.includes(selectedExp.value))
    }

    return matchKeyword && matchMajor && matchEdu && matchExp
  })
})

// 分页
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredJobs.value.slice(start, start + pageSize.value)
})

// 交互
const selectMajor = (val: string) => {
  selectedMajor.value = val
  handleSearch()
}

const handleSearch = () => {
  currentPage.value = 1
}

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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

// 图片相关逻辑
const getLogoUrl = (logoName: string) => {
  try {
    return new URL(`../assets/img/${logoName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}

const handleImgError = (jobId: string) => {
  imgErrorMap[jobId] = true
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
/* ================= 基础与头部 ================= */
.page-container { min-height: 100vh; display: flex; flex-direction: column; background-color: #f4f5f7; }
.banner-header { width: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding-bottom: 60px; position: relative; overflow: hidden; flex-shrink: 0; }
.bg-grid { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px); mask-image: radial-gradient(circle at center, black 40%, transparent 80%); -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%); pointer-events: none; }
.top-nav { position: relative; z-index: 2; border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(8px); margin-bottom: 50px; }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; height: 60px; display: flex; justify-content: space-between; align-items: center; }
.nav-logo { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: #fff; font-weight: 500; }
.banner-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center; }
.sub-title { font-size: 13px; letter-spacing: 3px; color: #93c5fd; font-weight: 600; margin-bottom: 16px; }
.main-title { font-size: 40px; font-weight: bold; margin: 0 0 16px 0; letter-spacing: 2px; text-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.desc { font-size: 16px; color: #cbd5e1; margin-bottom: 40px; }
.search-wrapper { display: flex; max-width: 700px; margin: 0 auto; background: white; border-radius: 8px; padding: 6px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
.search-input { flex: 1; border: none; padding: 12px 20px; font-size: 16px; outline: none; background: transparent; border-radius: 6px; }
.search-input::placeholder { color: #94a3b8; }
.search-btn { background: #2563eb; color: white; border: none; padding: 0 40px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; transition: background 0.2s; }
.search-btn:hover { background: #1d4ed8; }

/* ================= 主体内容 ================= */
.main-content { flex: 1; width: 100%; max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.filter-panel { background: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02); border: 1px solid #e5e7eb; }
.filter-row { display: flex; align-items: center; }
.filter-row + .filter-row { margin-top: 16px; }
.filter-label { font-size: 14px; color: #64748b; font-weight: 500; white-space: nowrap; margin-right: 16px; }
.filter-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.tab { padding: 6px 16px; background: #f8fafc; border-radius: 6px; cursor: pointer; font-size: 14px; color: #475569; border: 1px solid transparent; transition: all 0.2s ease; }
.tab:hover { background: #eff6ff; color: #2563eb; }
.tab.active { background: #2563eb; color: white; font-weight: 500; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3); }
.filter-divider { height: 1px; background: #f1f5f9; margin: 16px 0; }
.custom-select { width: 130px; margin-right: 16px; }
:deep(.custom-select .el-input__wrapper) { border-radius: 6px; box-shadow: 0 0 0 1px #e2e8f0 inset; background: #f8fafc; }
:deep(.custom-select .el-input__wrapper:hover) { box-shadow: 0 0 0 1px #93c5fd inset; }
:deep(.custom-select .el-input__wrapper.is-focus) { background: white; box-shadow: 0 0 0 1px #2563eb inset; }
.reset-btn { margin-left: auto; color: #94a3b8; font-size: 14px; }
.reset-btn:hover:not(.is-disabled) { color: #ef4444; }

/* ================= 卡片网格 ================= */
.job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.job-card { background: white; border-radius: 10px; padding: 24px; position: relative; border: 1px solid #e5e7eb; transition: all 0.3s ease; display: flex; flex-direction: column; }
.job-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08); border-color: #bfdbfe; }
.card-top { margin-bottom: 16px; }
.job-title { 
  font-size: 18px; 
  font-weight: 600; 
  color: #1e293b; 
  margin: 0 0 12px 0; 
  line-height: 1.4; 
  /* 新增以下三行，实现单行截断 */
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { background: #f1f5f9; color: #64748b; font-size: 12px; padding: 4px 10px; border-radius: 6px; font-weight: 500; }
.major-tag { background: #eff6ff; color: #2563eb; }
.card-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; flex: 1; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* 底部信息 */
.card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 16px; margin-top: auto; }

/* 新增：公司信息布局 (包含微型 Logo) */
.company-info {
  display: flex;
  align-items: center;
  gap: 8px; /* Logo 和文字的间距 */
  max-width: 75%;
}

/* 微型 Logo 包裹层 */
.mini-logo-wrapper {
  width: 20px;
  height: 20px;
  border-radius: 4px; /* 小圆角 */
  overflow: hidden;
  border: 1px solid #f1f5f9; /* 极浅边框 */
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 微型图片 */
.mini-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 微型兜底彩色块 */
.mini-logo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: bold;
}

/* 公司名称文字 */
.company { 
  color: #475569; 
  font-weight: 500; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.card-link { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; }

/* ================= 分页与空状态 ================= */
.pagination-container { display: flex; justify-content: center; margin-top: 50px; padding-bottom: 20px; }
:deep(.el-pagination.is-background .el-pager li.is-active) { background-color: #2563eb; }
:deep(.el-pagination.is-background .el-pager li:hover) { color: #2563eb; }
.empty-tip { text-align: center; padding: 80px 20px; color: #94a3b8; font-size: 16px; background: white; border-radius: 12px; border: 1px dashed #cbd5e1; }
.empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.5; }
</style>