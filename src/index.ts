import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getLiteBangumi, getPointDetails, searchBangumiSubject } from './api'
import { objectToXML } from './utils'

const server = new McpServer({
  name: 'Anitabi MCP Server',
  version: '1.0.0',
})

server.tool(
  'search_animate_subject',
  '根据关键词搜索对应的 bangumi 条目 id',
  { keyword: z.string() },
  async ({ keyword }) => {
    const result = await searchBangumiSubject(keyword)

    return {
      content: [{
        type: 'text',
        text: objectToXML(result),
      }],
    }
  },
)

server.tool(
  'get_bangumi_stage_lite_by_id',
  '根据 bangumi 作品 id 获取巡礼地点的轻量信息',
  { id: z.string() },
  async ({ id }) => {
    const result = await getLiteBangumi(id)

    return {
      content: [{
        type: 'text',
        text: objectToXML({ ...result, more: `https://anitabi.cn/map?bangumiId=${id}` }),
      }],
    }
  },
)

server.tool(
  'get_bangumi_stage_point_detail_by_id',
  '根据 Bangumi 作品 id 获取对应巡礼地标详情信息',
  { id: z.string() },
  async ({ id }) => {
    const result = await getPointDetails(id)

    return {
      content: [{
        type: 'text',
        text: objectToXML({ ...result, inMap: `https://anitabi.cn/map?bangumiId=${id}` }),
      }],
    }
  },
)

const transport = new StdioServerTransport()
server.connect(transport)
