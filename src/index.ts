import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { searchBangumiSubject } from './api'
import { objectToXML } from './utils'

const server = new McpServer({
  name: 'Anitabi MCP Server',
  version: '1.0.0',
})

server.tool('search_animate_subject', { keyword: z.string() }, async ({ keyword }) => {
  const result = await searchBangumiSubject(keyword)

  return {
    content: [{
      type: 'text',
      text: objectToXML(result),
    }],
  }
})

const transport = new StdioServerTransport()
server.connect(transport)
