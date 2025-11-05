import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  // 'https://apiktexpro-dev.rkshaon.info'
  (typeof window !== 'undefined' ? '/api' : 'https://apiktexpro-dev.rkshaon.info')

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})

export default api
