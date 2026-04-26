import { axios } from '@/lib/axios-shim'
import { getApiBaseUrl, getApiTimeout, getApiRetries } from './env'
import { getAuthToken } from './auth-config'

export interface ClientFactoryOptions {
  baseURL?: string
  timeout?: number
  retries?: number
  withCredentials?: boolean
  headers?: Record<string, string>
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
    const token = getAuthToken()
    if (token) {
      config.headers['x-session-token'] = token
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API RESPONSE ERROR:', error.config?.url, error.response?.status, error.response?.data)
      return Promise.reject(error)
    }
  )

  return client
}

export function createAuthenticatedClient(options: ClientFactoryOptions = {}) {
  return createApiClient({ ...options })
}

export function createPublicClient(options: ClientFactoryOptions = {}) {
  return createApiClient({ ...options, withCredentials: false })
}

export default createApiClient
