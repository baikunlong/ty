import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import JobDetail from '../views/JobDetail.vue'
import CompanyList from '../views/CompanyList.vue'
import CompanyDetail from '../views/CompanyDetail.vue'
import NewsList from '../views/NewsList.vue' // 引入新页面
import JobList from '../views/JobList.vue'
import SupplyForm from '../views/SupplyForm.vue'
import DemandForm from '../views/DemandForm.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/news', name: 'NewsList', component: NewsList },
    { path: '/company/:name', name: 'CompanyDetail', component: CompanyDetail },
    { path: '/CompanyList', name: 'CompanyList', component: CompanyList },
    { path: '/JobList', name: 'JobList', component: JobList },
    { path: '/supply-form', name: 'SupplyForm', component: SupplyForm },
    { path: '/job/:id', name: 'JobDetail', component: JobDetail },
    { path: '/demand-form', name: 'DemandForm', component: DemandForm }
  ]
})

export default router