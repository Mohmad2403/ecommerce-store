import axios from 'axios'

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'

// Strip any trailing slashes
rawBaseURL = rawBaseURL.replace(/\/+$/, '')

// Ensure /api is appended if user only entered the root domain
if (!rawBaseURL.endsWith('/api')) {
    rawBaseURL = `${rawBaseURL}/api`
}

const baseURL = `${rawBaseURL}/`

const api = axios.create({
    baseURL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api