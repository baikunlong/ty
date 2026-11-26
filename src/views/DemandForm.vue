<template>
  <div class="form-container">
    <!-- 顶部导航，和首页保持一致 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="logo-area">
          <img src="../assets/logo.png" alt="重庆城市管理职业大学" class="school-logo" />
          <!-- <span class="divider">|</span>
          <span class="platform-name">重庆国际物流产教联合体</span> -->
        </div>
        <!-- <div class="back-home">
          <router-link to="/">返回首页</router-link>
        </div> -->
      </div>
    </header>

    <div class="wrap">
      <div class="card">
        <div v-if="!submitSuccess" class="form-wrap">
          <h2 class="title">企业岗位需求填报</h2>
          <p class="tip">填写企业岗位信息，提交后3-5个工作日内完成审核反馈</p>

          <el-form ref="formRef" :model="form" label-width="140px" :rules="rules">
            <!-- <el-form-item label="岗位ID" prop="job_id">
              <el-input v-model="form.job_id" placeholder="自动生成或自行填写"></el-input>
            </el-form-item> -->
            <el-form-item label="岗位名称" prop="title">
              <el-input v-model="form.title" placeholder="岗位名称"></el-input>
            </el-form-item>
            <el-form-item label="薪资范围" prop="salary">
              <el-input v-model="form.salary" placeholder="例如：9-12k"></el-input>
            </el-form-item>
            <el-form-item label="工作经验要求" prop="require_work_years">
              <el-input v-model="form.require_work_years" placeholder="例如：3-5年"></el-input>
            </el-form-item>
            <el-form-item label="学历要求" prop="require_edu_level">
              <el-input v-model="form.require_edu_level" placeholder="例如：统招本科"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="comp_name">
              <el-input v-model="form.comp_name" placeholder="企业名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="企业规模">
              <el-input v-model="form.comp_scale" placeholder="例如：500-999人"></el-input>
            </el-form-item>
            <el-form-item label="企业阶段">
              <el-input v-model="form.comp_stage" placeholder="例如：不需要融资"></el-input>
            </el-form-item>
            <el-form-item label="企业行业">
              <el-input v-model="form.comp_industry" placeholder="例如：新能源汽车"></el-input>
            </el-form-item> -->
            <el-form-item label="联系人" prop="recruiter_name">
              <el-input v-model="form.recruiter_name" placeholder="联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系人职位">
              <el-input v-model="form.recruiter_title" placeholder="联系人职位"></el-input>
            </el-form-item>
            <el-form-item label="工作详细地址" prop="street_address">
              <el-input v-model="form.street_address" placeholder="工作详细地址"></el-input>
            </el-form-item>
            <el-form-item label="工作地区">
              <el-input v-model="form.address_locality" placeholder="工作地区"></el-input>
            </el-form-item>
            <el-form-item label="岗位职责与描述" prop="ld2_description">
              <el-input v-model="form.ld2_description" type="textarea" :rows="7" placeholder="岗位详情、任职要求"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="loading">提交信息</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 提交成功页面 -->
        <div v-else class="success-wrap">
          <div class="success-icon">✅</div>
          <h2>提交成功</h2>
          <p class="success-desc">您提交的岗位信息已收到，3-5个工作日内审核反馈</p>
          <!-- <div class="summary">
            <p><strong>岗位：</strong>{{ form.title }}</p>
            <p><strong>企业：</strong>{{ form.comp_name }}</p>
            <p><strong>联系人：</strong>{{ form.recruiter_name }}</p>
          </div> -->
          <div class="btn-group">
            <el-button type="primary" @click="submitSuccess=false; resetForm()">继续填报</el-button>
            <!-- <router-link to="/">
              <el-button>返回首页</el-button>
            </router-link> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <!-- <footer class="site-footer">
      <div class="footer-copyright">
        © 2026 西部陆海新通道沿线产教供需对接平台
      </div>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)
const submitSuccess = ref(false)

// 预置你给的这条岗位数据
const form = ref({
  job_id: "",
  title: "",
  salary: "",
  require_work_years: "",
  require_edu_level: "",
  comp_name: "",
  comp_scale: "",
  comp_stage: "",
  comp_logo: "",
  comp_industry: "",
  recruiter_name: "",
  recruiter_title: "",
  pub_date: "",
  up_date: "",
  ld2_description: ``,
  street_address: "",
  address_locality: "",
  address_region: ""
})

const rules = ref({
  job_id: [{ required: true, message: '请填写岗位ID', trigger: 'blur' }],
  title: [{ required: true, message: '请填写岗位标题', trigger: 'blur' }],
  salary: [{ required: true, message: '请填写薪资', trigger: 'blur' }],
  require_work_years: [{ required: true, message: '请填写经验要求', trigger: 'blur' }],
  require_edu_level: [{ required: true, message: '请填写学历要求', trigger: 'blur' }],
  comp_name: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
  recruiter_name: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
  street_address: [{ required: true, message: '请填写工作地址', trigger: 'blur' }],
  ld2_description: [{ required: true, message: '请填写岗位描述', trigger: 'blur' }]
})

const handleSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  // 这里替换成真实接口
  // await api.post('/job', form.value)
  await new Promise(resolve => setTimeout(resolve, 1200))
  loading.value = false
  submitSuccess.value = true
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped>
.form-container {
  padding-top: 64px;
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
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
.back-home a {
  color: #cbd5e1;
  font-size: 15px;
}
.back-home a:hover { color: #fff; }

.wrap {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 36px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}
.title {
  font-size: 24px;
  color: #0f172a;
  margin: 0 0 8px;
}
.tip {
  color: #64748b;
  margin-bottom: 24px;
}

.success-wrap {
  text-align: center;
  padding: 30px 0;
}
.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.success-wrap h2 {
  color: #16a34a;
  margin: 0 0 10px;
}
.success-desc {
  color: #475569;
  margin-bottom: 24px;
}
.summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  margin-bottom: 24px;
}
.summary p {
  margin: 8px 0;
  color: #334155;
}
.btn-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.site-footer {
  background: #0b1120;
  color: #e2e8f0;
  padding: 30px;
  border-top: 1px solid #1e293b;
  margin-top: 40px;
}
.footer-copyright {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}
</style>
