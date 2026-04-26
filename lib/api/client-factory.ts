import { axios } from '@/lib/axios-shim'
import { getApiBaseUrl, getApiTimeout, getApiRetries } from './env'
import { getAuthToken } from './auth-config'

export interface ClientFactoryOptions {
  baseURL?: string
  timeout?: number
  retries?: number
  withCredentials?: boolean
  headers?: Record<string, string>
  auth?: 'required' | 'optional' | 'none'
}

export function createApiClient(options: ClientFactoryOptions = {}) {
  const baseURL = options.baseURL || getApiBaseUrl()
  const timeout = options.timeout || getApiTimeout()
  const retries = options.retries || getApiRetries()
  const withCredentials = options.withCredentials ?? true

  const client = axios.create({
    baseURL,
    timeout,
    retries,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  client.interceptors.request.use((config) => {
    if (!config.withCredentials || config.headers?.['Cookie'] === undefined) {
      const token = getAuthToken()
      if (token) {
        config.headers = {
          ...config.headers,
          'x-session-token': token,
        }
      }
    }
    if (config.auth !== 'none') {
      const token = getAuthToken()
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('=== API RESPONSE ERROR ===')
      console.error('URL:', error.config?.url)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Message:', error.message)
      return Promise.reject(error)
    }
  )

  return client
}

export function createAuthenticatedClient(options: ClientFactoryOptions = {}) {
  return createApiClient({
    ...options,
    auth: 'required',
  })
}

export function createPublicClient(options: ClientFactoryOptions = {}) {
  return createApiClient({
    ...options,
    auth: 'none',
  })
}

export default createApiClient
