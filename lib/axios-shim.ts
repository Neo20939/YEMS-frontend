import { axios as kiattpAxios } from 'kiattp/axios'

export interface AxiosResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: any
}

export interface AxiosError<T = any> extends Error {
  isAxiosError: true
  response?: {
    status: number
    data: T
    headers: Record<string, string>
  }
  config?: any
  code?: string
}

export interface AxiosInstance {
  get<T = unknown>(url: string, config?: any): Promise<AxiosResponse<T>>
  post<T = unknown>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>
  put<T = unknown>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>
  patch<T = unknown>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>
  delete<T = unknown>(url: string, config?: any): Promise<AxiosResponse<T>>
  defaults: {
    baseURL?: string
    timeout?: number
    headers?: Record<string, string>
    withCredentials?: boolean
    credentials?: RequestCredentials
  }
  interceptors: {
    request: {
      use(onFulfilled: (config: any) => any, onRejected?: (error: any) => any): void
    }
    response: {
      use(onFulfilled: (response: any) => any, onRejected?: (error: any) => any): void
    }
  }
  create(config?: any): AxiosInstance
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as any).isAxiosError === true
  )
}

const shimmedInstance = kiattpAxios as unknown as AxiosInstance
export const axios: AxiosInstance & { isAxiosError: typeof isAxiosError } = Object.assign(shimmedInstance, {
  isAxiosError,
})
