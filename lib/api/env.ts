export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_LOCAL_URL) {
    return process.env.NEXT_PUBLIC_API_LOCAL_URL.replace(/\/$/, '')
  }
  return 'http://localhost/shdhfh@s/api'
}

export const getApiProxyPath = (): string => {
  return '/api'
}

export const getApiTimeout = (): number => {
  const timeout = process.env.API_TIMEOUT
  return timeout ? parseInt(timeout, 10) : 30000
}

export const getApiRetries = (): number => {
  const retries = process.env.API_RETRIES
  return retries ? parseInt(retries, 10) : 3
}