import { z } from 'zod'

export const LitePointSchema = z.object({
  id: z.string(),
  cn: z.string().optional().nullable(),
  name: z.string(),
  image: z.string(),
  ep: z.number(),
  s: z.number(),
  geo: z.tuple([z.number(), z.number()]),
})

export const LiteBangumiSchema = z.object({
  id: z.number(),
  cn: z.string().optional().nullable(),
  title: z.string(),
  city: z.string().optional().nullable(),
  cover: z.string(),
  color: z.string(),
  geo: z.tuple([z.number(), z.number()]),
  zoom: z.number(),
  modified: z.number(),
  litePoints: z.array(LitePointSchema),
  pointsLength: z.number(),
  imagesLength: z.number(),
})
export type LiteBangumiDTO = z.infer<typeof LiteBangumiSchema>

export const PointDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  ep: z.union([z.string(), z.number()]).optional().nullable(),
  s: z.union([z.string(), z.number()]).optional().nullable(),
  geo: z.tuple([z.number(), z.number()]),
  origin: z.string().optional(),
  originURL: z.string().optional(),
})

export const PointDetailListSchema = z.array(PointDetailSchema)
export type PointDetailListDTO = z.infer<typeof PointDetailListSchema>

const BangumiSubjectImagesSchema = z.object({
  large: z.string(),
  common: z.string(),
  medium: z.string(),
  small: z.string(),
  grid: z.string(),
})

export const BangumiSubjectSchema = z.object({
  id: z.number(),
  url: z.string(),
  type: z.number(),
  name: z.string(),
  name_cn: z.string().optional().nullable(),
  summary: z.string(),
  air_date: z.string(),
  air_weekday: z.number(),
  images: BangumiSubjectImagesSchema,
})

export const BangumiSearchResponseSchema = z.object({
  results: z.number(),
  list: z.array(BangumiSubjectSchema),
})
export type BangumiSearchResponseDTO = z.infer<typeof BangumiSearchResponseSchema>
