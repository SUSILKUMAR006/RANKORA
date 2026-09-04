import axios from 'axios'

// Base URL configured via Vite environment variable
// In production unified deployment, defaults to relative '/api' unless VITE_API_URL is provided
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

// Create standardized Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem('rankora_token') ||
        JSON.parse(localStorage.getItem('rankora_auth') || '{}')?.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // ignore parse failure
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Centralized Response & Error Handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const errorResponse = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred.',
      errors: error.response?.data?.errors || null,
      isNetworkError: !error.response,
    }

    // Handle unauthorized session expiration
    if (errorResponse.status === 401) {
      try {
        localStorage.removeItem('rankora_token')
      } catch {
        // ignore
      }
    }

    return Promise.reject(errorResponse)
  }
)

export function formatApiError(error) {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return 'System communication anomaly detected.'
}

export default api
