import { isAxiosError } from 'axios'
import { INSUFFICIENT_NOTES_MESSAGE } from '@/constants/study'
import type { ApiErrorBody } from '@/types/api'

export class ApiError extends Error {
  readonly code: string
  readonly status?: number

  constructor(message: string, code: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export const insufficientNotesError = () => new ApiError(INSUFFICIENT_NOTES_MESSAGE, 'INSUFFICIENT_CONTENT')

const FALLBACK_MESSAGES: Record<string, string> = {
  INSUFFICIENT_CONTENT: INSUFFICIENT_NOTES_MESSAGE,
  LLM_ERROR: 'The AI could not process your notes. Please try again.',
  PAYLOAD_TOO_LARGE: 'Your notes are too long. Please shorten them and try again.',
  INTERNAL_ERROR: 'Something went wrong on the server. Please try again.',
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status
    const body = error.response?.data?.error

    if (body?.code) {
      return new ApiError(body.message || FALLBACK_MESSAGES[body.code] || 'Request failed.', body.code, status)
    }
    if (status === 404) return new ApiError('This feature is not available yet.', 'NOT_FOUND', status)
    if (!error.response) {
      return new ApiError('Cannot reach the server. Check your connection and try again.', 'NETWORK_ERROR')
    }
    return new ApiError(FALLBACK_MESSAGES.INTERNAL_ERROR, 'INTERNAL_ERROR', status)
  }

  return new ApiError(FALLBACK_MESSAGES.INTERNAL_ERROR, 'UNKNOWN_ERROR')
}
