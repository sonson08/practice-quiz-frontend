import axios from 'axios'
import { toApiError } from '@/api/apiError'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

export const isApiConfigured = API_BASE_URL.length > 0

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
)

export default axiosClient
