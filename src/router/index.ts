import { createRouter, createWebHistory } from 'vue-router'
import JobList from '../views/JobList.vue'
import JobDetail from '../views/JobDetail.vue'
import CompanyList from '../views/CompanyList.vue'
import CompanyDetail from '../views/CompanyDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'CompanyList', component: CompanyList },
    { path: '/company/:name', name: 'CompanyDetail', component: CompanyDetail },
    { path: '/JobList', name: 'JobList', component: JobList },
    { path: '/job/:id', name: 'JobDetail', component: JobDetail },
  ]
})

export default router