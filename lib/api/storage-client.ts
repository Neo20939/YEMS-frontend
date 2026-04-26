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

export interface StorageFile {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: string
}

export interface PresignedUploadResponse {
  uploadUrl: string
  fileId: string
  expiresAt: string
}

export async function getPresignedUpload(data: {
  fileName: string
  mimeType: string
  folder?: string
}): Promise<PresignedUploadResponse> {
  const response = await axios.post<{ data: PresignedUploadResponse }>(
    `${API_BASE_URL}/storage/presigned-upload`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File
): Promise<{ success: boolean; fileId?: string }> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  if (response.ok) {
    const url = new URL(uploadUrl)
    const fileId = url.searchParams.get('fileId')
    return { success: true, fileId: fileId || undefined }
  }
  return { success: false }
}

export async function downloadFile(fileId: string): Promise<Blob> {
  const token = getAuthToken()
  const response = await fetch(
    `${API_BASE_URL}/storage/${fileId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to download file')
  }

  return response.blob()
}

export async function triggerFileDownload(fileId: string, fileName: string): Promise<void> {
  const blob = await downloadFile(fileId)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export async function deleteFile(fileId: string): Promise<void> {
  await axios.delete(
    `${API_BASE_URL}/storage/${fileId}`,
    getAxiosConfig()
  )
}

export async function getFileInfo(fileId: string): Promise<StorageFile> {
  const response = await axios.get<{ data: StorageFile }>(
    `${API_BASE_URL}/storage/${fileId}`,
    getAxiosConfig()
  )
  return response.data.data
}