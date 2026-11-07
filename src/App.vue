<template>
  <div class="page">
    <!-- 顶部搜索栏 -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">人才招聘</div>
        <div class="search-box">
          <input
            v-model.trim="keyword"
            class="search-input"
            type="text"
            placeholder="搜索职位 / 公司 / 地点"
          />
          <span class="search-count">共 {{ filteredJobs.length }} 个在招岗位</span>
        </div>
      </div>
    </header>

    <!-- 岗位卡片列表 -->
    <main class="job-grid">
      <div
        v-for="job in filteredJobs"
        :key="job.job_id"
        class="job-card"
        @click="openDetail(job)"
      >
        <div class="card-top">
          <h3 class="job-title">{{ job.title }}</h3>
          <span class="job-salary">{{ job.salary }}</span>
        </div>
        <div class="tag-row">
          <span class="tag">{{ job.require_work_years }}</span>
          <span class="tag">{{ job.require_edu_level }}</span>
        </div>
        <div class="comp-line">
          <span class="comp-name">{{ job.comp_name }}</span>
          <span class="comp-meta">{{ job.comp_scale }} · {{ job.comp_stage }} · {{ job.comp_industry }}</span>
        </div>
        <div class="card-bottom">
          <span class="addr">📍 {{ job.address_locality }}</span>
          <span class="date">{{ formatDate(job.up_date) }} 更新</span>
        </div>
      </div>
      <div v-if="filteredJobs.length === 0" class="empty">没有符合条件的岗位</div>
    </main>

    <!-- 岗位详情弹窗 -->
    <transition name="fade">
      <div v-if="currentJob" class="modal-mask" @click.self="closeDetail">
        <div class="modal">
          <button class="modal-close" @click="closeDetail">×</button>
          <div class="modal-head">
            <h2>{{ currentJob.title }}</h2>
            <div class="modal-salary">{{ currentJob.salary }}</div>
          </div>
          <div class="modal-tags">
            <span class="tag">{{ currentJob.require_work_years }}</span>
            <span class="tag">{{ currentJob.require_edu_level }}</span>
            <span class="tag">{{ currentJob.comp_name }}</span>
            <span class="tag">{{ currentJob.comp_scale }}</span>
            <span class="tag">{{ currentJob.comp_stage }}</span>
            <span class="tag">{{ currentJob.comp_industry }}</span>
          </div>
          <div class="modal-info">
            <p>工作地点：{{ currentJob.street_address }}</p>
            <p>发布时间：{{ formatDate(currentJob.pub_date) }}</p>
            <p>更新时间：{{ formatDate(currentJob.up_date) }}</p>
            <p>
              联系人：{{ currentJob.recruiter_name }}（{{ currentJob.recruiter_title }}）
            </p>
          </div>
          <div class="modal-desc">{{ currentJob.ld2_description }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 直接引入本地岗位数据，开发与打包环境均可正常加载
import jobsData from '../static/d.json'

export default {
  name: 'App',
  data() {
    return {
      // 全部岗位数据
      jobs: jobsData,
      // 搜索关键字
      keyword: '',
      // 当前弹窗展示的岗位，null 表示弹窗关闭
      currentJob: null
    }
  },
  computed: {
    // 按关键字过滤岗位：匹配职位名、公司名、地点
    filteredJobs() {
      const kw = this.keyword.toLowerCase()
      if (!kw) return this.jobs
      return this.jobs.filter(job =>
        [job.title, job.comp_name, job.address_locality, job.street_address]
          .some(field => String(field).toLowerCase().includes(kw))
      )
    }
  },
  methods: {
    // 点击卡片打开详情弹窗
    openDetail(job) {
      this.currentJob = job
      // 弹窗打开时禁止背景滚动
      document.body.style.overflow = 'hidden'
    },
    // 关闭详情弹窗
    closeDetail() {
      this.currentJob = null
      document.body.style.overflow = ''
    },
    // 格式化 ISO 时间为易读格式
    formatDate(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f5f6fa;
  color: #333;
}

/* ===== 顶部搜索栏 ===== */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #4f6ef7, #6a5cff);
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.35);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  white-space: nowrap;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  flex: 1;
  max-width: 480px;
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 19px;
  outline: none;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.95);
}

.search-count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  white-space: nowrap;
}

/* ===== 卡片列表 ===== */
.job-grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.job-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.job-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(79, 110, 247, 0.18);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-salary {
  color: #ff6b35;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.tag-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #4f6ef7;
  background: #eef1ff;
}

.comp-line {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #eee;
}

.comp-name {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.comp-meta {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.card-bottom {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 14px;
}

/* ===== 详情弹窗 ===== */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal {
  position: relative;
  background: #fff;
  border-radius: 14px;
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f0f2f7;
  color: #666;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  background: #e2e5ee;
}

.modal-head h2 {
  font-size: 22px;
  color: #222;
  padding-right: 40px;
}

.modal-salary {
  margin-top: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #ff6b35;
}

.modal-tags {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.modal-info {
  margin-top: 16px;
  padding: 14px 16px;
  background: #f8f9fc;
  border-radius: 8px;
  font-size: 13px;
  color: #555;
  line-height: 1.9;
}

.modal-desc {
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.8;
  color: #444;
  /* 保留职位描述中的换行 */
  white-space: pre-wrap;
}

/* 弹窗过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
