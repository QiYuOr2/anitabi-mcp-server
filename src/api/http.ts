import { REQUEST_TIMEOUT_MS, UA } from '../constants'

const headers = {
  'User-Agent': UA,
  'accept': 'application/json',
}

export class ApiRequestError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

function describeNetworkError(error: unknown): string {
  if (!(error instanceof Error))
    return '网络请求失败'
  if (error.name === 'TimeoutError' || error.name === 'AbortError')
    return '请求超时，请稍后重试'

  const cause = error.cause
  const code = cause && typeof cause === 'object' && 'code' in cause ? String(cause.code) : ''
  if (code === 'UND_ERR_CONNECT_TIMEOUT' || (cause instanceof Error && cause.name === 'ConnectTimeoutError'))
    return '连接超时，请稍后重试'
  if (cause instanceof Error && cause.message && cause.message !== error.message)
    return `${error.message}：${cause.message}`
  return error.message
}

export async function fetchJson(url: string | URL): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  }
  catch (error) {
    throw new ApiRequestError(describeNetworkError(error))
  }

  const text = await response.text()
  if (!response.ok) {
    const detail = text.replace(/\s+/g, ' ').slice(0, 160)
    if (response.status === 404)
      throw new ApiRequestError('未找到该作品，请检查 subject id', response.status)
    throw new ApiRequestError(`请求失败 HTTP ${response.status}${detail ? `：${detail}` : ''}`, response.status)
  }

  if (!text)
    throw new ApiRequestError('接口返回空响应')

  try {
    return JSON.parse(text) as unknown
  }
  catch {
    throw new ApiRequestError('接口返回的不是 JSON')
  }
}
