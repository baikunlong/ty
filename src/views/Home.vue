<template>
  <div class="home-container">
    <!-- 顶部导航栏 (已固定) -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area">
          <img src="../assets/logo.png" alt="重庆城市管理职业大学" class="school-logo" />
          <span class="divider">|</span>
          <span class="platform-name">重庆国际物流产教联合体</span>
        </div>
        <nav class="nav-links">
          <router-link to="/news">政策新闻</router-link>
          <router-link to="/">供给信息</router-link>
          <router-link to="/JobList">需求信息</router-link>
        </nav>

      </div>
    </header>

    <!-- Hero 区域 (带背景图和搜索) -->
    <section class="hero-section">
      <div class="hero-bg" :style="{ backgroundImage: `url(${heroBg})` }"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content-wrap">
        <!-- 左侧二维码卡片 -->
        <div class="hero-qrcode-card">
          <div class="qrcode-box">
            <img v-if="supplyQrImg" :src="supplyQrImg" alt="供给填报二维码" />
            <div v-else class="loading">生成中...</div>
          </div>
          <div class="qrcode-text">
            <div class="qrcode-title">供给入口</div>
            <!-- <div class="qrcode-tip">院校生源填报</div> -->
          </div>
        </div>

        <div class="hero-content">
          <div class="sub-title">MODERN LOGISTICS · TALENT MATCHING PLATFORM</div>
          <h1 class="main-title">西部陆海新通道沿线产教供需对接平台</h1>
          <p class="desc">服务国际物流、智能物流、跨境电商与关务外贸产业链人才需求，汇聚沿线院校生源、专业与校内招聘会资源，对接企业岗位需求，构建产教融合协同服务枢纽。</p>

          <div class="search-wrapper">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索岗位标题 / 企业名称"
              class="search-input"
              @keyup.enter="handleGlobalSearch"
            />
            <button class="search-btn" @click="handleGlobalSearch">搜索</button>
          </div>
        </div>

        <!-- 右侧二维码卡片 -->
        <div class="hero-qrcode-card">
          <div class="qrcode-box">
            <img v-if="demandQrImg" :src="demandQrImg" alt="需求填报二维码" />
            <div v-else class="loading">生成中...</div>
          </div>
          <div class="qrcode-text">
            <div class="qrcode-title">需求入口</div>
            <!-- <div class="qrcode-tip">企业岗位填报</div> -->
          </div>
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

    <!-- ==================== 主体内容：左中右三栏 ==================== -->
    <main class="main-content">
      <div class="three-col-grid">

        <!-- 1. 政策新闻 -->
        <section id="news" class="section-block">
          <div class="block-cover">
            <img src="../assets/index1.png" alt="政策新闻" />
            <div class="cover-title">
              <h2>政策新闻</h2>
              <span>POLICY NEWS</span>
            </div>
          </div>

          <ul class="info-list">
            <li v-for="news in newsPreview" :key="news.id" @click="openNewsModal(news)">
              <span class="dot"></span>
              <span class="list-title" :title="news.news_title">{{ news.news_title }}</span>
              <span class="list-extra">{{ news.publish_time }}</span>
            </li>
          </ul>

          <div class="more-wrapper">
            <router-link to="/news" class="more-btn">更多</router-link>
          </div>
        </section>

        <!-- 2. 供给信息 -->
        <section id="supply" class="section-block">
          <div class="block-cover">
            <img src="../assets/index2.png" alt="供给信息" />
            <div class="cover-title">
              <h2>供给信息</h2>
              <span>SUPPLY INFO</span>
            </div>
          </div>

          <ul class="info-list">
            <li v-for="major in majorPreview" :key="major.id" @click="openSupplyModal">
              <span class="dot"></span>
              <span class="list-title" :title="major.major_name">{{ major.major_name }}</span>
              <span class="list-extra highlight">{{ major.graduate_count }} 人</span>
            </li>
          </ul>

          <div class="more-wrapper">
            <button class="more-btn" @click="openSupplyModal">更多</button>
          </div>
        </section>

        <!-- 3. 需求信息 -->
        <section id="demand" class="section-block">
          <div class="block-cover">
            <img src="../assets/index3.png" alt="需求信息" />
            <div class="cover-title">
              <h2>需求信息</h2>
              <span>DEMAND INFO</span>
            </div>
          </div>

          <ul class="info-list" v-if="jobPreview.length > 0">
            <li v-for="job in jobPreview" :key="job.job_id" @click="openJobModal(job)">
              <span class="dot"></span>
              <span class="list-title" :title="job.title">{{ job.title }}</span>
              <span class="list-extra">{{ job.require_edu_level || '学历不限' }}</span>
            </li>
          </ul>
          <ul class="info-list" v-else>
            <li class="empty-item">暂无符合条件的招聘信息</li>
          </ul>

          <div class="more-wrapper">
            <router-link to="/JobList" class="more-btn">更多</router-link>
          </div>
        </section>

      </div>

      <!-- ==================== 弹框 ==================== -->

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

      <!-- 供给信息弹框（生源信息 / 校内招聘会） -->
      <div v-if="showSupplyModal" class="modal-overlay" @click.self="closeSupplyModal">
        <div class="modal-content supply-modal">
          <button class="close-btn" @click="closeSupplyModal">×</button>
          <h2 class="modal-title">供给信息</h2>

          <div class="supply-tabs">
            <span :class="{ active: supplyModalTab === 'source' }" @click="supplyModalTab = 'source'">毕业生源信息</span>
            <span :class="{ active: supplyModalTab === 'major' }" @click="supplyModalTab = 'major'">专业介绍</span>
            <span :class="{ active: supplyModalTab === 'fair' }" @click="supplyModalTab = 'fair'">校内招聘会</span>
          </div>

          <div class="modal-scroll">
            <!-- Tab 1：毕业生源信息 -->
            <div v-if="supplyModalTab === 'source'" class="table-wrapper">
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

            <!-- Tab 2：专业介绍 -->
            <div v-if="supplyModalTab === 'major'" class="major-intro-grid">
              <div class="intro-card" v-for="major in businessMajors" :key="major.id">
                <h4>{{ major.major_name }}</h4>
                <p class="intro-text">{{ major.major_intro }}</p>
              </div>
            </div>

            <!-- Tab 3：校内招聘会 -->
            <div v-if="supplyModalTab === 'fair'" class="table-wrapper">
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
      <div class="footer-copyright">
        © 2026 西部陆海新通道沿线产教供需对接平台
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QRCode from 'qrcode'
import jobData from '../data/jobData.json'
import newsData from '../data/channel_policy_news.json'
import majorData from '../data/major_info.json'
import fairData from '../data/job_fair.json'
import heroBg from '../assets/hero-bg.jpg'

/** 首页每栏最多展示的条目数 */
const LIST_LIMIT = 5

// --- 二维码配置，这里替换成你实际的填报地址 ---
const supplyUrl = ref('https://cgsxy.yujs.top/#/supply-form')
const demandUrl = ref('https://cgsxy.yujs.top/#/demand-form')

const supplyQrImg = ref('')
const demandQrImg = ref('')

const createQrCode = async (text: string) => {
  return QRCode.toDataURL(text, {
    width: 120,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000',
      light: '#fff'
    }
  })
}

onMounted(async () => {
  supplyQrImg.value = await createQrCode(supplyUrl.value)
  demandQrImg.value = await createQrCode(demandUrl.value)
})

// --- 弹框状态 ---
const selectedNews = ref<any>(null)
const selectedJob = ref<any>(null)
const showSupplyModal = ref(false)
const supplyModalTab = ref('source')

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

const openSupplyModal = () => {
  showSupplyModal.value = true
  supplyModalTab.value = 'source'
  document.body.style.overflow = 'hidden'
}
const closeSupplyModal = () => {
  showSupplyModal.value = false
  document.body.style.overflow = 'auto'
}

// --- 全局状态 ---
const searchKeyword = ref('')

// --- 数据 ---
const businessMajors = computed(() => majorData.filter(m => m.college_name === '商学院'))
const newsList = ref(newsData)
const fairList = ref(fairData)

// 三栏列表预览数据
const newsPreview = computed(() => newsList.value.slice(0, LIST_LIMIT))
const majorPreview = computed(() => businessMajors.value.slice(0, LIST_LIMIT))

// 需求信息（受顶部搜索框关键词影响）
const filteredJobs = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return jobData
  return jobData.filter(job =>
    (job.title || '').toLowerCase().includes(kw) ||
    (job.comp_name || '').toLowerCase().includes(kw)
  )
})
const jobPreview = computed(() => filteredJobs.value.slice(0, LIST_LIMIT))

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

// 平滑滚动 (由于头部固定，留出余量)
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

const handleGlobalSearch = () => {
  scrollTo('demand')
}
</script>

<style scoped>
/* ================= 基础布局 ================= */
.home-container {
  padding-top: 64px;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
a { text-decoration: none; color: inherit; }
ul, li { list-style: none; margin: 0; padding: 0; }

/* ================= 顶部导航 ================= */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #0b1120;
  color: white;
  z-index: 1000;
  height: 64px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.header-inner {
  max-width: 90%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.logo-area { display: flex; align-items: center; gap: 12px; }
.school-logo { height: 36px; object-fit: contain; }
.divider { color: rgba(255,255,255,0.3); }
.platform-name { font-size: 24px; font-weight: 600; letter-spacing: 1px; }
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
.hero-content-wrap {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.hero-content {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
}
.hero-qrcode-card {
  flex-shrink: 0;
  text-align: center;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
}
.qrcode-box {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  background: #fff;
  padding: 6px;
  border-radius: 8px;
}
.qrcode-box img {
  width: 100%;
  height: 100%;
  display: block;
}
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
}
.qrcode-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.qrcode-tip {
  font-size: 12px;
  color: #cbd5e1;
}
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

/* ================= 主体内容：三栏布局 ================= */
.main-content {
  max-width: 90%;
  margin: 0 auto; padding: 40px 20px 60px; }

.three-col-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: stretch;
}

.section-block {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  scroll-margin-top: 80px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.section-block:hover {
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

/* 每栏顶部图片 */
.block-cover {
  position: relative;
  height: 150px;
  overflow: hidden;
  background: #0f172a;
}
.block-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}
.section-block:hover .block-cover img { transform: scale(1.06); }
.cover-title {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 22px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.12));
}
.cover-title h2 {
  color: #fff;
  font-size: 21px;
  font-weight: 600;
  margin: 0 0 6px;
  letter-spacing: 2px;
}
.cover-title span {
  color: #38bdf8;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
}

/* 列表 */
.info-list {
  flex: 1;
  padding: 6px 18px;
}
.info-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  border-bottom: 1px dashed #eef2f7;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s;
}
.info-list li:last-child { border-bottom: none; }
.info-list li:hover .list-title { color: #2563eb; }
.info-list li:hover .dot { background: #38bdf8; transform: scale(1.3); }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  flex-shrink: 0;
  transition: all 0.18s;
}
.list-title {
  flex: 1;
  min-width: 0;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.18s;
}
.list-extra {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
}
.list-extra.highlight { color: #ef4444; font-weight: 600; }
.empty-item {
  justify-content: center;
  color: #94a3b8;
  cursor: default;
  padding: 30px 0;
}

/* 更多按钮 */
.more-wrapper { padding: 12px 18px 18px; }
.more-btn {
  display: block;
  width: 100%;
  padding: 9px 0;
  border-radius: 8px;
  background: #f1f5f9;
  color: #2563eb;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.5;
  border: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.more-btn:hover {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-content-wrap { flex-direction: column; gap: 20px; }
  .three-col-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 680px) {
  .three-col-grid { grid-template-columns: 1fr; }
  .main-title { font-size: 28px; }
}

/* ================= 供给信息弹框内表格 ================= */
.supply-tabs { display: flex; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; }
.supply-tabs span {
  padding: 8px 16px; font-size: 15px; color: #475569; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s;
}
.supply-tabs span:hover { color: #2563eb; }
.supply-tabs span.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }

.supply-modal { max-width: 900px; }
.modal-scroll { flex: 1; overflow-y: auto; padding-right: 4px; }

.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; }
.data-table th, .data-table td { padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155; }
.data-table th { background: #f8fafc; font-weight: 600; color: #1e293b; }
.data-table tbody tr:hover td { background: #f8fafc; }
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

/* 专业介绍卡片 */
.major-intro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.intro-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
.intro-card h4 { color: #1e293b; margin: 0 0 10px 0; font-size: 16px; }
.intro-text { font-size: 14px; color: #64748b; line-height: 1.7; }

/* ================= 底部 ================= */
.site-footer {
  background: #0b1120; color: #e2e8f0; padding: 40px; border-top: 1px solid #1e293b;
}
.footer-copyright { max-width: 1200px; margin: 0 auto; text-align: center; font-size: 13px; color: #64748b; }

/* ================= 弹框通用样式 ================= */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
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

.job-modal-body { flex: 1; overflow-y: auto; padding-right: 10px; }
.job-modal-body h3 {
  font-size: 16px; color: #1e293b; margin: 20px 0 12px 0;
  border-left: 4px solid #2563eb; padding-left: 10px; line-height: 1;
}
.job-modal-body h3:first-child { margin-top: 0; }

.desc-text { line-height: 1.8; color: #475569; white-space: pre-wrap; font-size: 14px; }
.contact-box {
  background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-top: 10px;
}
.contact-box p { margin: 0 0 8px 0; color: #475569; font-size: 14px; }
.contact-box p:last-child { margin-bottom: 0; }

.tag { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #f1f5f9; color: #64748b; }
.tag.edu { background: #eff6ff; color: #2563eb; }
</style>
