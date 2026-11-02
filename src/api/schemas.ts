import { z } from 'zod'

export const GeoSchema = z.tuple([z.number(), z.number()])

export const LitePointSchema = z.object({
  id: z.string(),
  cn: z.string().nullish(),
  name: z.string(),
  image: z.string().nullish(),
  ep: z.number().nullish(),
  s: z.number().nullish(),
  geo: GeoSchema.nullish(),
  origin: z.string().nullish(),
  originURL: z.string().nullish(),
})

export const LiteBangumiSchema = z.object({
  id: z.number(),
  cn: z.string().nullish(),
  title: z.string(),
  city: z.string().nullish(),
  cover: z.string().nullish(),
  color: z.string().nullish(),
  geo: GeoSchema.nullish(),
  zoom: z.number().nullish(),
  modified: z.number().nullish(),
  litePoints: z.array(LitePointSchema),
  pointsLength: z.number(),
  imagesLength: z.number(),
})
export type LiteBangumiDTO = z.infer<typeof LiteBangumiSchema>
export type LitePointDTO = z.infer<typeof LitePointSchema>

export const PointDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  ep: z.union([z.string(), z.number()]).nullish(),
  s: z.union([z.string(), z.number()]).nullish(),
  geo: GeoSchema.nullish(),
  origin: z.string().nullish(),
  originURL: z.string().nullish(),
})

export const PointDetailListSchema = z.array(PointDetailSchema)
export type PointDetailListDTO = z.infer<typeof PointDetailListSchema>
export type PointDetailDTO = z.infer<typeof PointDetailSchema>

const BangumiSubjectImagesSchema = z.object({
  large: z.string().optional(),
  common: z.string().optional(),
  medium: z.string().optional(),
  small: z.string().optional(),
  grid: z.string().optional(),
}).partial()

export const BangumiSubjectSchema = z.object({
  id: z.number(),
  url: z.string(),
  type: z.number(),
  name: z.string(),
  name_cn: z.string().nullish(),
  summary: z.string().nullish(),
  air_date: z.string().nullish(),
  air_weekday: z.number().nullish(),
  images: BangumiSubjectImagesSchema.nullish(),
})

export const BangumiSearchResponseSchema = z.object({
  results: z.number(),
  list: z.array(BangumiSubjectSchema),
})
export type BangumiSearchResponseDTO = z.infer<typeof BangumiSearchResponseSchema>
