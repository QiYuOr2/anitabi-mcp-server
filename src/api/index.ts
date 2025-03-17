import type { z } from 'zod'
import { BangumiSearchResponseSchema, LiteBangumiSchema, PointDetailListSchema } from './schemas'

const ANITABI_BASE_URL = 'https://api.anitabi.cn/'
const BANGUMI_BASE_URL = 'https://api.bgm.tv/'
const UA = 'qiyuor2/anitabi-mcp-server'

const headers = {
  'User-Agent': UA,
  'accept': 'application/json',
}

/**
 * 根据 Bangumi 作品 id 获取对应巡礼地标信息
 * @param subjectID 作品 id
 * @returns 对应巡礼地标信息
 */
export async function getLiteBangumi(subjectID: number | string): Promise<z.infer<typeof LiteBangumiSchema>> {
  const url = `${ANITABI_BASE_URL}bangumi/${subjectID}/lite`

  const response = await fetch(url, { headers })
  const result = await response.json()

  return LiteBangumiSchema.parse(result)
}

/**
 * 根据 Bangumi 作品 id 获取对应巡礼地标详情信息
 * @param subjectID 作品 id
 * @param haveImage 筛选含图地标
 * @returns 对应巡礼地标详情信息
 */
export async function getPointDetails(subjectID: number, haveImage: boolean = true): Promise<z.infer<typeof PointDetailListSchema>> {
  const url = `${ANITABI_BASE_URL}bangumi/${subjectID}/points/detail`

  const response = await fetch(`${url}${haveImage ? `?haveImage=${haveImage}` : ''}`, { headers })
  const result = await response.json()

  return PointDetailListSchema.parse(result)
}

/**
 * 根据 bangumi 作品 ID 获得巡礼地图地址
 * @param id
 * @returns 巡礼地图地址
 */
export function getAnitabiSubjectURLById(id: number): string {
  return `${ANITABI_BASE_URL}/map?bangumiId=${id}`
}

/**
 * 搜索 Bangumi 条目
 * @param keyword 关键词
 * @returns 匹配的条目列表
 */
export async function searchBangumiSubject(keyword: string): Promise<z.infer<typeof BangumiSearchResponseSchema>> {
  const url = `${BANGUMI_BASE_URL}search/subject/${encodeURIComponent(keyword)}`

  const params = new URLSearchParams({
    type: '2',
    responseGroup: 'small',
  })

  const response = await fetch(`${url}?${params.toString()}`, { headers })
  const result = await response.json()

  return BangumiSearchResponseSchema.parse(result)
}
