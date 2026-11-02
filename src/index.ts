#!/usr/bin/env node

import type { CallToolResult } from '@modelcontextprotocol/server'
import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import pkg from '../package.json'
import { getLiteBangumi, getPointDetails, searchBangumiSubject } from './api'
import {
  ANITABI_MAP_URL,
  DEFAULT_POINT_LIMIT,
  DEFAULT_SEARCH_LIMIT,
  MAX_POINT_LIMIT,
  MAX_SEARCH_LIMIT,
} from './constants'
import { formatLite, formatPointDetails, formatSearch } from './format'
import { clampInt, objectToXML, toErrorMessage } from './utils'

const subjectId = z.union([
  z.string().regex(/^\d+$/),
  z.number().int().positive(),
]).describe('Bangumi 作品 subject id')

function textResult(data: object): CallToolResult {
  return {
    content: [{
      type: 'text',
      text: objectToXML(data),
    }],
  }
}

function errorResult(error: unknown): CallToolResult {
  return {
    isError: true,
    content: [{
      type: 'text',
      text: toErrorMessage(error),
    }],
  }
}

function mapUrl(id: string): string {
  return `${ANITABI_MAP_URL}?bangumiId=${id}`
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: pkg.displayName,
    version: pkg.version,
  })

  server.registerTool(
    'search_animate_subject',
    {
      description: '按关键词搜索 Bangumi 动画条目，返回 subject id。只搜索动画（type=2）。拿到 id 后再查巡礼信息。',
      inputSchema: z.object({
        keyword: z.string().min(1).describe('作品名或关键词'),
        limit: z.number().int().min(1).max(MAX_SEARCH_LIMIT).optional().describe(`返回条数，默认 ${DEFAULT_SEARCH_LIMIT}`),
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async ({ keyword, limit }) => {
      try {
        const size = clampInt(limit, DEFAULT_SEARCH_LIMIT, 1, MAX_SEARCH_LIMIT)
        const result = await searchBangumiSubject(keyword, size)
        return textResult(formatSearch(result, size))
      }
      catch (error) {
        return errorResult(error)
      }
    },
  )

  server.registerTool(
    'get_bangumi_stage_lite_by_id',
    {
      description: '按 Bangumi subject id 获取巡礼概要：城市、地标数量和代表性地点。接口未返回坐标时会省略 geo，请用 map 链接查看地图。展示截图时保留 origin 与 originURL。',
      inputSchema: z.object({
        id: subjectId,
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async ({ id }) => {
      try {
        const subject = String(id)
        const result = await getLiteBangumi(subject)
        return textResult(formatLite(result, mapUrl(subject)))
      }
      catch (error) {
        return errorResult(error)
      }
    },
  )

  server.registerTool(
    'get_bangumi_stage_point_detail_by_id',
    {
      description: '按 Bangumi subject id 获取巡礼地标详情。默认只返回前 20 条，可用 offset 翻页。展示截图时必须保留 origin 与 originURL（CC BY-NC-SA）。接口未返回坐标时省略 geo。',
      inputSchema: z.object({
        id: subjectId,
        haveImage: z.boolean().optional().describe('只返回含截图的地标，默认 true'),
        limit: z.number().int().min(1).max(MAX_POINT_LIMIT).optional().describe(`本次返回条数，默认 ${DEFAULT_POINT_LIMIT}`),
        offset: z.number().int().min(0).optional().describe('跳过前 N 条，默认 0'),
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async ({ id, haveImage, limit, offset }) => {
      try {
        const subject = String(id)
        const size = clampInt(limit, DEFAULT_POINT_LIMIT, 1, MAX_POINT_LIMIT)
        const start = clampInt(offset, 0, 0, Number.MAX_SAFE_INTEGER)
        const result = await getPointDetails(subject, { haveImage })
        return textResult(formatPointDetails(result, {
          id: subject,
          mapUrl: mapUrl(subject),
          limit: size,
          offset: start,
        }))
      }
      catch (error) {
        return errorResult(error)
      }
    },
  )

  return server
}

void serveStdio(createServer)
