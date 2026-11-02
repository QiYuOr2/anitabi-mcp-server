import { ZodError } from 'zod'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

function fieldsToXml(obj: Record<string, unknown>): string {
  let xml = ''
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null)
      continue
    xml += nodeToXml(key, value)
  }
  return xml
}

function nodeToXml(key: string, value: unknown): string {
  if (Array.isArray(value)) {
    const items = value.filter(item => item !== undefined && item !== null)
    if (items.every(isPrimitive))
      return `<${key}>${items.map(item => escapeXml(String(item))).join(',')}</${key}>`

    return items.map((item) => {
      if (isRecord(item))
        return `<${key}>${fieldsToXml(item)}</${key}>`
      return `<${key}>${escapeXml(String(item))}</${key}>`
    }).join('')
  }

  if (isRecord(value))
    return `<${key}>${fieldsToXml(value)}</${key}>`

  return `<${key}>${escapeXml(String(value))}</${key}>`
}

export function objectToXML(obj: object, rootName = 'root'): string {
  return `<${rootName}>${fieldsToXml(obj as Record<string, unknown>)}</${rootName}>`
}

export function clampInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value))
    return fallback
  return Math.min(max, Math.max(min, Math.trunc(value)))
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    const issue = error.issues[0]
    const path = issue?.path.join('.') || 'root'
    return `接口数据校验失败：${path} ${issue?.message ?? ''}`.trim()
  }
  if (error instanceof Error)
    return error.message
  return '未知错误'
}

export function toHdImage(url: string | null | undefined): string | undefined {
  if (!url)
    return undefined
  const hd = url.replace('plan=h160', 'plan=h360')
  return hd === url ? undefined : hd
}
