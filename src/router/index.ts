import { createRouter, createWebHistory } from 'vue-router'
import JobList from '../views/JobList.vue'
import JobDetail from '../views/JobDetail.vue'
import CompanyList from '../views/CompanyList.vue'
import CompanyDetail from '../views/CompanyDetail.vue' // 新增引入

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'JobList', component: JobList },
    { path: '/job/:id', name: 'JobDetail', component: JobDetail },
    { path: '/companies', name: 'CompanyList', component: CompanyList },
    // 新增公司详情页路由，通过 name 传参
    { path: '/company/:name', name: 'CompanyDetail', component: CompanyDetail } 
  ]
})

export default router