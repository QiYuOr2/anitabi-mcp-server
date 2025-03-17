import { z } from 'zod'

export const LitePointSchema = z.object({
  id: z.string(),
  cn: z.string(),
  name: z.string(),
  image: z.string(),
  ep: z.number(),
  s: z.number(),
  geo: z.tuple([z.number(), z.number()]),
})

export const LiteBangumiSchema = z.object({
  id: z.number(),
  cn: z.string(),
  title: z.string(),
  city: z.string(),
  cover: z.string(),
  color: z.string(),
  geo: z.tuple([z.number(), z.number()]),
  zoom: z.number(),
  modified: z.number(),
  litePoints: z.array(LitePointSchema),
  pointsLength: z.number(),
  imagesLength: z.number(),
})

export const PointDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  ep: z.number(),
  s: z.number(),
  geo: z.tuple([z.number(), z.number()]),
  origin: z.string(),
  originURL: z.string(),
})

export const PointDetailListSchema = z.array(PointDetailSchema)

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
  name_cn: z.string(),
  summary: z.string(),
  air_date: z.string(),
  air_weekday: z.number(),
  images: BangumiSubjectImagesSchema,
})

export const BangumiSearchResponseSchema = z.object({
  results: z.number(),
  list: z.array(BangumiSubjectSchema),
})
