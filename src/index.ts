import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getLiteBangumi, searchBangumiSubject } from './api'
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
  'get_bangumi_stage_by_id',
  '根据 bangumi id 获取巡礼地点信息',
  { id: z.string() },
  async ({ id }) => {
    const result = await getLiteBangumi(id)

    return {
      content: [{
        type: 'text',
        text: objectToXML(result),
      }],
    }
  },
)

const transport = new StdioServerTransport()
server.connect(transport)
