// API Configuration
// In production, this will use the VITE_API_URL environment variable
// In development, it will use localhost:3001

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const config = {
  apiUrl: API_URL,
  apiTimeout: 30000, // 30 seconds
  maxFileSize: 5 * 1024 * 1024, // 5MB for payment screenshots
}

export default config
