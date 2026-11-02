import type { BangumiSearchResponseDTO, LiteBangumiDTO, LitePointDTO, PointDetailDTO, PointDetailListDTO } from './api/schemas'
import { toHdImage } from './utils'

export interface FormattedPoint {
  id: string
  cn?: string | null
  name: string
  image?: string | null
  imageHd?: string
  ep?: string | number | null
  s?: string | number | null
  geo?: [number, number] | null
  origin?: string | null
  originURL?: string | null
}

export interface FormattedSearch {
  total: number
  returned: number
  subjects: Array<{
    id: number
    name: string
    nameCn?: string | null
    airDate?: string | null
    url: string
  }>
}

export interface FormattedLite {
  id: number
  cn?: string | null
  title: string
  city?: string | null
  cover?: string | null
  color?: string | null
  geo?: [number, number] | null
  zoom?: number | null
  modified?: number | null
  pointsLength: number
  imagesLength: number
  map: string
  points: FormattedPoint[]
}

export interface FormattedPointPage {
  id: string
  total: number
  offset: number
  returned: number
  map: string
  points: FormattedPoint[]
}

function formatPoint(point: LitePointDTO | PointDetailDTO): FormattedPoint {
  return {
    id: point.id,
    cn: 'cn' in point ? point.cn : undefined,
    name: point.name,
    image: point.image,
    imageHd: toHdImage(point.image),
    ep: point.ep,
    s: point.s,
    geo: point.geo,
    origin: point.origin,
    originURL: point.originURL,
  }
}

export function formatSearch(data: BangumiSearchResponseDTO, limit: number): FormattedSearch {
  const subjects = data.list.slice(0, limit).map(item => ({
    id: item.id,
    name: item.name,
    nameCn: item.name_cn,
    airDate: item.air_date,
    url: item.url,
  }))

  return {
    total: data.results,
    returned: subjects.length,
    subjects,
  }
}

export function formatLite(data: LiteBangumiDTO, mapUrl: string): FormattedLite {
  return {
    id: data.id,
    cn: data.cn,
    title: data.title,
    city: data.city,
    cover: data.cover,
    color: data.color,
    geo: data.geo,
    zoom: data.zoom,
    modified: data.modified,
    pointsLength: data.pointsLength,
    imagesLength: data.imagesLength,
    map: mapUrl,
    points: data.litePoints.map(formatPoint),
  }
}

export function formatPointDetails(points: PointDetailListDTO, options: { id: string, mapUrl: string, limit: number, offset: number }): FormattedPointPage {
  const slice = points.slice(options.offset, options.offset + options.limit)
  return {
    id: options.id,
    total: points.length,
    offset: options.offset,
    returned: slice.length,
    map: options.mapUrl,
    points: slice.map(formatPoint),
  }
}
