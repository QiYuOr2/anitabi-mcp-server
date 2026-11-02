import type { BangumiSearchResponseDTO, LiteBangumiDTO, PointDetailListDTO } from './schemas'
import { ANITABI_BASE_URL, BANGUMI_BASE_URL, MAX_SEARCH_LIMIT } from '../constants'
import { clampInt } from '../utils'
import { fetchJson } from './http'
import { BangumiSearchResponseSchema, LiteBangumiSchema, PointDetailListSchema } from './schemas'

export interface PointQuery {
  haveImage?: boolean
  limit?: number
  offset?: number
}

function subjectId(id: number | string): string {
  const value = String(id).trim()
  if (!/^\d+$/.test(value))
    throw new Error('subject id 必须是数字')
  return value
}

/**
 * 根据 Bangumi 作品 id 获取巡礼概要。
 * 现网 lite 地标经常不带 geo，坐标字段保持可选。
 */
export async function getLiteBangumi(subjectID: number | string): Promise<LiteBangumiDTO> {
  const url = `${ANITABI_BASE_URL}bangumi/${subjectId(subjectID)}/lite`
  return LiteBangumiSchema.parse(await fetchJson(url))
}

/**
 * 根据 Bangumi 作品 id 获取巡礼地标详情。
 */
export async function getPointDetails(subjectID: number | string, options: PointQuery = {}): Promise<PointDetailListDTO> {
  const id = subjectId(subjectID)
  const haveImage = options.haveImage !== false
  const url = new URL(`${ANITABI_BASE_URL}bangumi/${id}/points/detail`)
  if (haveImage)
    url.searchParams.set('haveImage', 'true')

  const result = PointDetailListSchema.parse(await fetchJson(url))
  if (result.length === 0)
    throw new Error('未找到该作品的地标，请检查 subject id 是否正确')

  return result
}

/**
 * 搜索 Bangumi 动画条目。旧版 search 接口仍可用，并用 max_results 限制体积。
 */
export async function searchBangumiSubject(keyword: string, limit?: number): Promise<BangumiSearchResponseDTO> {
  const q = keyword.trim()
  if (!q)
    throw new Error('关键词不能为空')

  const maxResults = clampInt(limit, 8, 1, MAX_SEARCH_LIMIT)
  const url = new URL(`${BANGUMI_BASE_URL}search/subject/${encodeURIComponent(q)}`)
  url.searchParams.set('type', '2')
  url.searchParams.set('responseGroup', 'small')
  url.searchParams.set('max_results', String(maxResults))

  return BangumiSearchResponseSchema.parse(await fetchJson(url))
}
