import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Pages
import LoginPage from '@/pages/LoginPage.vue'
import Home from '@/pages/Home.vue'
import Users from '@/pages/Users.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginPage,
        meta: { title: 'Login - KTexPro' }
      }
    ]
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'Dashboard - KTexPro' }
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { title: 'User Management - KTexPro' }
      }
      // Add more dashboard pages here...
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard & page title
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken')

  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
