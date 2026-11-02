import process from 'node:process'
import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'

const entry = process.argv[2] ?? 'dist/index.cjs'

function textOf(result: { content?: unknown, isError?: boolean }): string {
  const blocks = Array.isArray(result.content) ? result.content : []
  return blocks
    .map((block) => {
      if (block && typeof block === 'object' && 'text' in block && typeof block.text === 'string')
        return block.text
      return ''
    })
    .join('\n')
}

function assertOk(name: string, result: { content?: unknown, isError?: boolean }, needles: string[]): string {
  const text = textOf(result)
  if (result.isError)
    throw new Error(`${name} 返回错误：${text}`)
  for (const needle of needles) {
    if (!text.includes(needle))
      throw new Error(`${name} 结果缺少「${needle}」\n${text.slice(0, 500)}`)
  }
  return text
}

const client = new Client({ name: 'anitabi-mcp-smoke', version: '1.2.0' })
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [entry],
  stderr: 'pipe',
})

let stderr = ''
transport.stderr?.on('data', (chunk) => {
  stderr += String(chunk)
})

await client.connect(transport)

try {
  const listed = await client.listTools()
  const names = listed.tools.map(tool => tool.name).sort()
  const expected = [
    'get_bangumi_stage_lite_by_id',
    'get_bangumi_stage_point_detail_by_id',
    'search_animate_subject',
  ]
  if (names.join() !== expected.join())
    throw new Error(`工具列表不符：${names.join(', ')}`)

  const invalid = await client.callTool({
    name: 'get_bangumi_stage_lite_by_id',
    arguments: { id: 'not-a-number' },
  })
  if (!invalid.isError)
    throw new Error(`非法 id 应返回 isError，实际：${textOf(invalid).slice(0, 300)}`)

  const search = assertOk(
    'search_animate_subject',
    await client.callTool({
      name: 'search_animate_subject',
      arguments: { keyword: 'ユーフォニアム', limit: 3 },
    }),
    ['<subjects>', '<id>'],
  )

  const lite = assertOk(
    'get_bangumi_stage_lite_by_id',
    await client.callTool({
      name: 'get_bangumi_stage_lite_by_id',
      arguments: { id: '115908' },
    }),
    ['<id>115908</id>', '<title>', 'bangumiId=115908', '<origin>'],
  )

  const detail = assertOk(
    'get_bangumi_stage_point_detail_by_id',
    await client.callTool({
      name: 'get_bangumi_stage_point_detail_by_id',
      arguments: { id: '115908', limit: 2 },
    }),
    ['<returned>2</returned>', '<originURL>', 'bangumiId=115908'],
  )

  console.log('tools:', names.join(', '))
  console.log('search bytes:', search.length)
  console.log('lite bytes:', lite.length)
  console.log('detail bytes:', detail.length)
  console.log('mcp smoke ok')
}
finally {
  await client.close()
  if (stderr.trim())
    console.error(stderr.trim())
}
