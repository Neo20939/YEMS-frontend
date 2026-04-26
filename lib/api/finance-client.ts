import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'

const API_BASE_URL = '/api'

function getAxiosConfig() {
  const token = getAuthToken()
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  }
}

export interface FeeRecord {
  id: string
  studentId: string
  studentName?: string
  classId: string
  className?: string
  academicYearId: string
  academicYearName?: string
  termId: string
  termName?: string
  amount: number
  paidAmount: number
  balance: number
  status: 'paid' | 'partial' | 'unpaid'
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateFeeRecordRequest {
  studentId: string
  classId: string
  academicYearId: string
  termId: string
  amount: number
  dueDate: string
}

export interface Payment {
  id: string
  feeRecordId: string
  amount: number
  paymentMethod: string
  referenceNumber?: string
  paidBy: string
  paidAt: string
  reversed: boolean
  reversedAt?: string
  createdAt: string
}

export interface CreatePaymentRequest {
  amount: number
  paymentMethod: string
  referenceNumber?: string
}

export interface FeeStats {
  totalExpected: number
  totalCollected: number
  totalOutstanding: number
  collectionRate: number
  studentCount: number
  paidCount: number
  partialCount: number
  unpaidCount: number
}

export async function getFeeRecords(filters?: {
  classId?: string
  academicYearId?: string
  termId?: string
  status?: string
  page?: number
  limit?: number
}): Promise<{ data: FeeRecord[]; pagination?: any }> {
  const params = new URLSearchParams()
  if (filters?.classId) params.append('classId', filters.classId)
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId)
  if (filters?.termId) params.append('termId', filters.termId)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await axios.get<{ data: FeeRecord[]; pagination?: any }>(
    `${API_BASE_URL}/finance/fee-records?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function getFeeRecordById(id: string): Promise<FeeRecord> {
  const response = await axios.get<{ data: FeeRecord }>(
    `${API_BASE_URL}/finance/fee-records/${id}`,
    getAxiosConfig()
  )
  return response.data.data
}

export async function createFeeRecord(data: CreateFeeRecordRequest): Promise<FeeRecord> {
  const response = await axios.post<{ data: FeeRecord }>(
    `${API_BASE_URL}/finance/fee-records`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function bulkCreateFeeRecords(data: {
  classId: string
  academicYearId: string
  termId: string
  amount: number
  dueDate: string
}[]): Promise<{ created: number; failed: number }> {
  const response = await axios.post<{ data: { created: number; failed: number } }>(
    `${API_BASE_URL}/finance/fee-records/bulk`,
    { records: data },
    getAxiosConfig()
  )
  return response.data.data
}

export async function updateFeeRecord(id: string, data: Partial<CreateFeeRecordRequest>): Promise<FeeRecord> {
  const response = await axios.patch<{ data: FeeRecord }>(
    `${API_BASE_URL}/finance/fee-records/${id}`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function getFeeRecordPayments(feeRecordId: string): Promise<{ data: Payment[] }> {
  const response = await axios.get<{ data: Payment[] }>(
    `${API_BASE_URL}/finance/fee-records/${feeRecordId}/payments`,
    getAxiosConfig()
  )
  return response.data
}

export async function createPayment(feeRecordId: string, data: CreatePaymentRequest): Promise<Payment> {
  const response = await axios.post<{ data: Payment }>(
    `${API_BASE_URL}/finance/payments`,
    { ...data, feeRecordId },
    getAxiosConfig()
  )
  return response.data.data
}

export async function reversePayment(paymentId: string): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/finance/payments/${paymentId}/reverse`,
    {},
    getAxiosConfig()
  )
}

export async function getStudentFeeStatus(studentId: string): Promise<{
  total: number
  paid: number
  outstanding: number
  records: FeeRecord[]
}> {
  const response = await axios.get<{ data: { total: number; paid: number; outstanding: number; records: FeeRecord[] } }>(
    `${API_BASE_URL}/finance/students/${studentId}/fee-status`,
    getAxiosConfig()
  )
  return response.data.data
}

export async function getTermFeeStats(termId: string): Promise<FeeStats> {
  const response = await axios.get<{ data: FeeStats }>(
    `${API_BASE_URL}/finance/stats/term/${termId}`,
    getAxiosConfig()
  )
  return response.data.data
}