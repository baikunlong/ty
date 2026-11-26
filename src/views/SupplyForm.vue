<template>
  <div class="supply-form-page">
    <!-- 顶部导航，和首页风格保持一致 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area">
          <img src="../assets/logo.png" alt="重庆城市管理职业大学" class="school-logo" />
          <!-- <span class="divider">|</span> -->
          <!-- <span class="platform-name">重庆国际物流产教联合体</span> -->
        </div>
        <!-- <router-link to="/" class="back-link">← 返回首页</router-link> -->
      </div>
    </header>

    <main class="form-main">
      <div class="form-card">
        <div class="form-header">
          <h1 class="form-title">供给信息填报</h1>
          <p class="form-subtitle">请填写院校 / 专业生源信息，提交后 3-5 个工作日内完成审核</p>
        </div>

        <!-- 表单 -->
        <form v-if="!submitted" class="supply-form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <label class="form-item full">
              <span class="label-text">专业名称 <em class="required">*</em></span>
              <input
                v-model.trim="form.major_name"
                type="text"
                class="form-input"
                placeholder="例如：现代物流管理"
              />
              <span v-if="errors.major_name" class="error-text">{{ errors.major_name }}</span>
            </label>
          </div>

          <div class="form-row two-col">
            <label class="form-item">
              <span class="label-text">学制 <em class="required">*</em></span>
              <select v-model="form.school_length" class="form-input">
                <option value="" disabled>请选择学制</option>
                <option value="2年">2年</option>
                <option value="3年">3年</option>
                <option value="4年">4年</option>
              </select>
              <span v-if="errors.school_length" class="error-text">{{ errors.school_length }}</span>
            </label>

            <label class="form-item">
              <span class="label-text">学历层次 <em class="required">*</em></span>
              <select v-model="form.education_level" class="form-input">
                <option value="" disabled>请选择学历层次</option>
                <option value="专科">专科</option>
                <option value="本科">本科</option>
                <option value="中职">中职</option>
              </select>
              <span v-if="errors.education_level" class="error-text">{{ errors.education_level }}</span>
            </label>
          </div>

          <div class="form-row three-col">
            <label class="form-item">
              <span class="label-text">男生人数 <em class="required">*</em></span>
              <input
                v-model.number="form.male_count"
                type="number"
                min="0"
                class="form-input"
                placeholder="0"
              />
              <span v-if="errors.male_count" class="error-text">{{ errors.male_count }}</span>
            </label>

            <label class="form-item">
              <span class="label-text">女生人数 <em class="required">*</em></span>
              <input
                v-model.number="form.female_count"
                type="number"
                min="0"
                class="form-input"
                placeholder="0"
              />
              <span v-if="errors.female_count" class="error-text">{{ errors.female_count }}</span>
            </label>

            <div class="form-item">
              <span class="label-text">毕业生人数</span>
              <input type="text" class="form-input readonly" :value="totalGraduates" readonly />
              <span class="hint-text">男生 + 女生 自动合计</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="resetForm">重置</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '提交中...' : '提交信息' }}
            </button>
          </div>
        </form>

        <!-- 提交成功状态 -->
        <div v-else class="success-state">
          <div class="success-icon">✓</div>
          <h2 class="success-title">提交成功</h2>
          <p class="success-desc">
            您的供给信息已提交，审核结果将在 <strong>3-5 个工作日</strong> 内通过，请留意后续通知。
          </p>
          <!-- <div class="success-summary">
            <div class="summary-item">
              <span class="summary-label">专业名称</span>
              <span class="summary-value">{{ form.major_name }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">学制 / 学历</span>
              <span class="summary-value">{{ form.school_length }} · {{ form.education_level }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">毕业生人数</span>
              <span class="summary-value">{{ totalGraduates }} 人</span>
            </div>
          </div> -->
          <button class="btn btn-primary" @click="resetForm">继续填报</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface SupplyForm {
  major_name: string
  school_length: string
  education_level: string
  male_count: number | null
  female_count: number | null
}

const defaultForm: SupplyForm = {
  major_name: '',
  school_length: '',
  education_level: '',
  male_count: null,
  female_count: null
}

const form = reactive<SupplyForm>({ ...defaultForm })
const errors = reactive<Record<string, string>>({})
const loading = ref(false)
const submitted = ref(false)

// 毕业生人数 = 男生 + 女生（自动合计）
const totalGraduates = computed(() => {
  const male = Number(form.male_count) || 0
  const female = Number(form.female_count) || 0
  return male + female
})

const validate = (): boolean => {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.major_name) {
    errors.major_name = '请填写专业名称'
  }
  if (!form.school_length) {
    errors.school_length = '请选择学制'
  }
  if (!form.education_level) {
    errors.education_level = '请选择学历层次'
  }
  if (form.male_count === null || form.male_count === undefined || Number.isNaN(Number(form.male_count)) || Number(form.male_count) < 0) {
    errors.male_count = '请填写有效男生人数'
  }
  if (form.female_count === null || form.female_count === undefined || Number.isNaN(Number(form.female_count)) || Number(form.female_count) < 0) {
    errors.female_count = '请填写有效女生人数'
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  // 模拟接口提交，实际项目替换为后端接口请求
  // const res = await api.post('/supply', { ...form, graduate_count: totalGraduates.value })
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  submitted.value = true
}

const resetForm = () => {
  Object.assign(form, defaultForm)
  Object.keys(errors).forEach(k => delete errors[k])
  submitted.value = false
  loading.value = false
}
</script>

<style scoped>
.supply-form-page {
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 顶部导航 */
.top-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: #0b1120;
  color: white;
  z-index: 1000;
  height: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
.divider { color: rgba(255, 255, 255, 0.3); }
.platform-name { font-size: 20px; font-weight: 600; letter-spacing: 1px; }
.back-link {
  color: #cbd5e1;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: #fff; }

/* 主体 */
.form-main {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}
.form-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  padding: 36px 32px;
}

.form-header { margin-bottom: 32px; }
.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}
.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 表单 */
.form-row {
  margin-bottom: 24px;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-item.full { grid-column: 1 / -1; }
.label-text {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}
.required { color: #ef4444; font-style: normal; margin-left: 2px; }

.form-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.form-input.readonly {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}
.error-text {
  font-size: 12px;
  color: #ef4444;
}
.hint-text {
  font-size: 12px;
  color: #94a3b8;
}

/* 按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.btn {
  padding: 11px 28px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) { background: #1d4ed8; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border-color: #e2e8f0;
}
.btn-secondary:hover { background: #e2e8f0; }

/* 成功状态 */
.success-state {
  text-align: center;
  padding: 24px 0;
}
.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 34px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}
.success-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0 auto 28px;
  max-width: 420px;
}
.success-desc strong { color: #166534; }

.success-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px 24px;
  margin: 0 auto 28px;
  max-width: 420px;
  text-align: left;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
}
.summary-item + .summary-item {
  border-top: 1px dashed #e2e8f0;
}
.summary-label { color: #64748b; }
.summary-value { color: #1e293b; font-weight: 600; }

/* 响应式 */
@media (max-width: 680px) {
  .two-col, .three-col { grid-template-columns: 1fr; }
  .form-card { padding: 24px 20px; }
  .form-actions { flex-direction: column-reverse; }
  .btn { width: 100%; }
}
</style>
