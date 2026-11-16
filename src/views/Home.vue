<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area">
          <img src="../assets/logoB.png" alt="重庆城市管理职业大学" class="school-logo" />
          <span class="divider">|</span>
          <span class="platform-name">西部陆海新通道沿线产教供需对接平台</span>
        </div>
        <nav class="nav-links">
          <a href="#news" @click.prevent="scrollTo('news')">政策新闻</a>
          <a href="#supply" @click.prevent="scrollTo('supply')">供给信息</a>
          <a href="#demand" @click.prevent="scrollTo('demand')">需求信息</a>
        </nav>
      </div>
    </header>

    <!-- Hero 区域 (带背景图和搜索) -->
    <section class="hero-section">
      <div class="hero-bg" :style="{ backgroundImage: `url(${heroBg})` }"></div>
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <div class="sub-title">MODERN LOGISTICS · TALENT MATCHING PLATFORM</div>
        <h1 class="main-title">西部陆海新通道沿线产教供需对接平台</h1>
        <p class="desc">服务通道物流、跨境电商与关务外贸产业链人才需求，汇聚沿线院校生源、专业与校内招聘会资源，对接企业岗位需求，构建产教融合协同服务枢纽。</p>
        
        <div class="search-wrapper">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索岗位标题 / 生源专业 / 政策新闻标题 / 企业名称" 
            class="search-input"
            @keyup.enter="handleGlobalSearch"
          />
          <button class="search-btn" @click="handleGlobalSearch">搜索</button>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="stats-container">
        <div class="stat-box">
          <div class="stat-num">{{ stats.majors }}<span>个</span></div>
          <div class="stat-label">在册对接专业</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ stats.graduates }}<span>人</span></div>
          <div class="stat-label">2026年学校可供人才</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ stats.jobs }}<span>条</span></div>
          <div class="stat-label">在招岗位需求</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ stats.fairs }}<span>场</span></div>
          <div class="stat-label">校内招聘会记录</div>
        </div>
      </div>
    </section>

    <!-- 主体内容 -->
    <main class="main-content">
      
      <!-- 1. 政策新闻 -->
      <section id="news" class="section-block">
        <div class="section-header">
          <h2 class="section-title"><span class="bar"></span>政策新闻</h2>
          <router-link to="/news" class="view-all">查看全部 ></router-link>
        </div>
        <div class="news-grid">
          <div class="news-card" v-for="news in newsList.slice(0, 6)" :key="news.id" @click="openNewsModal(news)">
            <h3 class="news-title">{{ news.news_title }}</h3>
            <p class="news-summary">{{ news.news_summary }}</p>
            <div class="news-footer">
              <span class="platform">{{ news.publish_platform }}</span>
              <span class="date">{{ news.publish_time }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 供给信息 -->
      <section id="supply" class="section-block">
        <div class="section-header">
          <h2 class="section-title"><span class="bar"></span>供给信息</h2>
          <div class="supply-tabs">
            <span :class="{ active: activeSupplyTab === 'source' }" @click="activeSupplyTab = 'source'">毕业生源信息</span>
            <span :class="{ active: activeSupplyTab === 'major' }" @click="activeSupplyTab = 'major'">专业介绍</span>
            <span :class="{ active: activeSupplyTab === 'fair' }" @click="activeSupplyTab = 'fair'">校内招聘会</span>
          </div>
        </div>

        <div class="supply-content">
          <!-- Tab 1: 毕业生源信息 -->
          <div v-if="activeSupplyTab === 'source'" class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>专业名称</th>
                  <th>学制</th>
                  <th>学历层次</th>
                  <th>男生</th>
                  <th>女生</th>
                  <th>毕业生人数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="major in businessMajors" :key="major.id">
                  <td>{{ major.major_name }}</td>
                  <td>{{ major.school_length }}</td>
                  <td>{{ major.education_level }}</td>
                  <td>{{ major.male_count }}</td>
                  <td>{{ major.female_count }}</td>
                  <td>{{ major.graduate_count }}</td>
                </tr>
                <tr class="total-row">
                  <td>合计</td>
                  <td>—</td>
                  <td>—</td>
                  <td>{{ totalMale }}</td>
                  <td>{{ totalFemale }}</td>
                  <td>{{ totalGraduates }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tab 2: 专业介绍 -->
          <div v-if="activeSupplyTab === 'major'" class="major-intro-grid">
            <div class="intro-card" v-for="major in businessMajors" :key="major.id">
              <h4>{{ major.major_name }}</h4>
              <p class="intro-text">{{ major.major_intro }}</p>
            </div>
          </div>

          <!-- Tab 3: 校内招聘会 -->
          <div v-if="activeSupplyTab === 'fair'" class="table-wrapper">
            <table class="data-table fair-table">
              <thead>
                <tr>
                  <th>招聘会名称</th>
                  <th>举办地址</th>
                  <th>举办日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fair in fairList" :key="fair.id">
                  <td>{{ fair.fair_title }}</td>
                  <td>{{ fair.fair_address }}</td>
                  <td>{{ fair.fair_date }}</td>
                  <td>
                    <span :class="['status-tag', getFairStatus(fair.fair_date).class]">
                      {{ getFairStatus(fair.fair_date).text }}
                    </span>
                  </td>
                  <td><a :href="fair.detail_url" target="_blank" class="link-btn">查看详情</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 3. 需求信息 -->
      <section id="demand" class="section-block">
        <!-- 修改 Home.vue 中的需求信息板块 -->
        <div class="section-header">
          <h2 class="section-title"><span class="bar"></span>需求信息</h2>
          <router-link to="/CompanyList" class="view-all">查看全部企业 ></router-link>
        </div>
        
        <!-- 筛选器 -->
        <div class="filter-bar">
          <div class="filter-group">
            <span class="label">专业方向：</span>
            <span 
              v-for="major in filterMajors" :key="major.value"
              :class="['filter-tag', { active: selectedMajor === major.value }]"
              @click="selectMajor(major.value)"
            >{{ major.label }}</span>
          </div>
          <div class="filter-group">
            <span class="label">其他条件：</span>
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

        <!-- 岗位卡片 (点击绑定 openJobModal) -->
        <div class="job-grid" v-if="paginatedJobs.length > 0">
          <div v-for="job in paginatedJobs" :key="job.job_id" class="job-card" @click="openJobModal(job)">
            <h3 class="job-title">{{ job.title }}</h3>
            <div class="tags">
              <span class="tag edu">{{ job.require_edu_level || '学历不限' }}</span>
              <span class="tag">{{ job.require_work_years || '经验不限' }}</span>
            </div>
            
            <p class="job-desc">{{ job.ld2_description || '暂无详细描述' }}</p>
            
            <div class="job-company">
              <img v-if="job.comp_logo" :src="getLogoUrl(job.comp_logo)" class="mini-logo" @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"/>
              <span class="comp-name">{{ job.comp_name }}</span>
            </div>
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
      </section>

      <!-- 新闻详情弹框 -->
      <div v-if="selectedNews" class="modal-overlay" @click.self="closeNewsModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeNewsModal">×</button>
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

      <!-- 岗位详情弹框 -->
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
            <span class="date">发布于 {{ selectedJob.up_date ? selectedJob.up_date.split('T')[0] : '' }}</span>
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
      <div class="footer-copyright">
        © 2026 西部陆海新通道沿线产教供需对接平台
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import jobData from '../data/jobData.json'
import newsData from '../data/channel_policy_news.json'
import majorData from '../data/major_info.json'
import fairData from '../data/job_fair.json'
import schoolLogo from '../assets/logoB.png'
import heroBg from '../assets/hero-bg.jpg'

// --- 弹框状态 ---
const selectedNews = ref<any>(null)
const selectedJob = ref<any>(null)

const openNewsModal = (news: any) => {
  selectedNews.value = news
  document.body.style.overflow = 'hidden'
}
const closeNewsModal = () => {
  selectedNews.value = null
  document.body.style.overflow = 'auto'
}

const openJobModal = (job: any) => {
  selectedJob.value = job
  document.body.style.overflow = 'hidden'
}
const closeJobModal = () => {
  selectedJob.value = null
  document.body.style.overflow = 'auto'
}

// --- 全局状态 ---
const searchKeyword = ref('')
const activeSupplyTab = ref('source')
const currentPage = ref(1)
const pageSize = ref(6)
const selectedMajor = ref('全部')
const selectedEdu = ref('')
const selectedExp = ref('')

// --- 数据过滤 ---
const businessMajors = computed(() => majorData.filter(m => m.college_name === '商学院'))
const newsList = ref(newsData)
const fairList = ref(fairData)

// 统计
const stats = computed(() => {
  const majorsCount = businessMajors.value.length
  const graduatesCount = businessMajors.value.reduce((sum, item) => sum + item.graduate_count, 0)
  return { majors: majorsCount, graduates: graduatesCount, jobs: jobData.length, fairs: fairData.length }
})

// 生源合计
const totalMale = computed(() => businessMajors.value.reduce((sum, item) => sum + item.male_count, 0))
const totalFemale = computed(() => businessMajors.value.reduce((sum, item) => sum + item.female_count, 0))
const totalGraduates = computed(() => businessMajors.value.reduce((sum, item) => sum + item.graduate_count, 0))

// 招聘会状态
const getFairStatus = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number)
  const fairDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (fairDate.getTime() === today.getTime()) {
    return { text: '进行中', class: 'ongoing' }
  } else if (fairDate > today) {
    return { text: '未开始', class: 'upcoming' }
  } else {
    return { text: '已结束', class: 'ended' }
  }
}

// 平滑滚动
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 需求信息逻辑
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
const handleCurrentChange = (val: number) => { currentPage.value = val; scrollTo('demand') }
const resetFilters = () => {
  searchKeyword.value = ''
  selectedMajor.value = '全部'
  selectedEdu.value = ''
  selectedExp.value = ''
  handleSearch()
}
const handleGlobalSearch = () => { scrollTo('demand') }

const getLogoUrl = (logoName: string) => {
  try { return new URL(`../assets/img/${logoName}`, import.meta.url).href } catch (e) { return '' }
}
</script>

<style scoped>
/* ================= 基础布局 ================= */
.home-container {
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
a { text-decoration: none; color: inherit; }
ul, li { list-style: none; margin: 0; padding: 0; }

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
.nav-links a { color: #cbd5e1; font-size: 15px; transition: color 0.2s; cursor: pointer; }
.nav-links a:hover { color: white; }

/* ================= Hero 区域 ================= */
.hero-section {
  position: relative;
  padding: 80px 20px 100px;
  color: white;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4));
  z-index: 1;
}
.hero-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
.sub-title { color: #38bdf8; font-size: 13px; letter-spacing: 4px; font-weight: 600; margin-bottom: 16px; }
.main-title { font-size: 42px; font-weight: bold; margin-bottom: 24px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); letter-spacing: 2px; }
.desc { font-size: 16px; color: #e2e8f0; line-height: 1.6; margin-bottom: 40px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

.search-wrapper {
  display: flex; background: white; border-radius: 8px; padding: 6px;
  max-width: 700px; margin: 0 auto; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.search-input { flex: 1; border: none; padding: 12px 20px; font-size: 16px; outline: none; border-radius: 6px; }
.search-btn { background: #2563eb; color: white; border: none; padding: 0 40px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.search-btn:hover { background: #1d4ed8; }

/* 统计面板 */
.stats-container {
  position: relative; z-index: 2; max-width: 1200px; margin: 50px auto 0;
  display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;
}
.stat-box {
  background: rgba(30, 58, 138, 0.6); backdrop-filter: blur(10px);
  border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px;
  padding: 20px 40px; min-width: 200px; text-align: center;
}
.stat-num { font-size: 32px; font-weight: bold; color: white; margin-bottom: 8px; font-family: 'Arial'; }
.stat-num span { font-size: 14px; margin-left: 4px; color: #93c5fd; }
.stat-label { font-size: 14px; color: #cbd5e1; }

/* ================= 主体内容 ================= */
.main-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px; }
.section-block { background: white; border-radius: 12px; padding: 30px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; scroll-margin-top: 80px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.section-title { font-size: 22px; color: #1e293b; display: flex; align-items: center; gap: 12px; margin: 0; }
.section-title .bar { width: 4px; height: 20px; background: #2563eb; border-radius: 2px; }
.view-all { color: #64748b; font-size: 14px; }
.view-all:hover { color: #2563eb; }

/* 新闻 */
.news-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.news-card { border: 1px solid #f1f5f9; border-radius: 8px; padding: 20px; transition: all 0.2s; cursor: pointer; }
.news-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #bfdbfe; }
.news-title { font-size: 16px; color: #1e293b; margin: 0 0 12px 0; font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.news-summary { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 44px; }
.news-footer { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; }

/* 供给信息 */
.supply-tabs { display: flex; gap: 12px; }
.supply-tabs span { padding: 6px 16px; font-size: 15px; color: #475569; cursor: pointer; border-bottom: 2px solid transparent; }
.supply-tabs span.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; }
.data-table th, .data-table td { padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155; }
.data-table th { background: #f8fafc; font-weight: 600; color: #1e293b; }
.data-table .total-row td { background: #f0fdf4; color: #166534; font-weight: bold; }

/* 校内招聘会表格 */
.fair-table th, .fair-table td { padding: 12px 10px; }
.fair-table th:nth-child(4), .fair-table td:nth-child(4),
.fair-table th:nth-child(5), .fair-table td:nth-child(5) { white-space: nowrap; width: 80px; }
.fair-table th:nth-child(3), .fair-table td:nth-child(3) { white-space: nowrap; width: 100px; }
.fair-table th:nth-child(1), .fair-table td:nth-child(1),
.fair-table th:nth-child(2), .fair-table td:nth-child(2) { text-align: left; min-width: 200px; word-break: break-all; }

.status-tag { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.status-tag.ended { background: #f1f5f9; color: #94a3b8; }
.status-tag.ongoing { background: #fef2f2; color: #ef4444; }
.status-tag.upcoming { background: #eff6ff; color: #3b82f6; }
.link-btn { color: #2563eb; font-size: 13px; }
.link-btn:hover { text-decoration: underline; }
.major-intro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.intro-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
.intro-card h4 { color: #1e293b; margin: 0 0 12px 0; font-size: 16px; }
.intro-text { font-size: 14px; color: #64748b; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

/* 需求信息 */
.filter-bar { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 8px; }
.filter-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.filter-group .label { font-size: 14px; color: #64748b; }
.filter-tag { padding: 4px 14px; font-size: 13px; border-radius: 20px; cursor: pointer; color: #475569; background: white; border: 1px solid #cbd5e1; }
.filter-tag.active { background: #2563eb; color: white; border-color: #2563eb; }
.filter-select { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; color: #334155; outline: none; }
.reset-btn { font-size: 13px; color: #94a3b8; cursor: pointer; margin-left: 10px; }
.reset-btn:hover { color: #ef4444; }

.job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
.job-card { 
  position: relative; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; 
  transition: all 0.2s; background: white; display: flex; flex-direction: column; cursor: pointer;
}
.job-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); border-color: #bfdbfe; }
.job-title { font-size: 16px; color: #1e293b; font-weight: 600; margin: 0 0 12px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tags { display: flex; gap: 8px; margin-bottom: 16px; }
.tag { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #f1f5f9; color: #64748b; }
.tag.edu { background: #eff6ff; color: #2563eb; }
.job-desc {
  font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 16px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;
}
.job-company { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-top: auto; }
.mini-logo { width: 20px; height: 20px; border-radius: 4px; object-fit: contain; }
.empty-tip { text-align: center; color: #94a3b8; padding: 40px; }
.pagination-wrapper { display: flex; justify-content: center; margin-top: 30px; }

/* ================= 底部 ================= */
.site-footer {
  background: #0b1120; color: #e2e8f0; padding: 40px 20px 20px; border-top: 1px solid #1e293b;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 20px; padding-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  /* 使用 flex 布局方便内部滚动 */
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
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  z-index: 10;
}
.close-btn:hover { background: #e2e8f0; color: #0f172a; }

/* 新闻弹框专属 */
.modal-title { font-size: 22px; color: #1e293b; margin: 0 0 16px 0; padding-right: 30px; line-height: 1.4; }
.modal-meta { display: flex; gap: 20px; font-size: 14px; color: #64748b; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
.modal-body { font-size: 15px; color: #334155; line-height: 1.8; overflow-y: auto; }
.modal-footer { margin-top: 30px; text-align: right; }
.source-link { color: #2563eb; font-weight: 500; font-size: 14px; }
.source-link:hover { text-decoration: underline; }

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

.job-modal-body {
  flex: 1; overflow-y: auto; padding-right: 10px; /* 内部滚动 */
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
</style>