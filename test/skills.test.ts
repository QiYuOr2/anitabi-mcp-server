import { Client } from '@modelcontextprotocol/client'
import { SkillsClient } from '@modelcontextprotocol/client/ext/skills'
import { InMemoryTransport } from '@modelcontextprotocol/server'
import { afterEach, describe, expect, it } from 'vitest'
import { createServer } from '../src/index'

describe('anitabi pilgrimage skill', () => {
  let client: Client | undefined

  afterEach(async () => {
    await client?.close()
  })

  it('serves the usage skill without repeating the http api', async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    const server = await createServer()
    await server.connect(serverTransport)

    client = new Client({ name: 'anitabi-skill-test', version: '1.2.0' })
    await client.connect(clientTransport)

    const skills = new SkillsClient(client)
    const listed = await skills.list()
    const entry = listed.skills.find(skill => skill.frontmatter.name === 'anitabi-pilgrimage')
    expect(entry?.frontmatter.description).toContain('不要直接请求 api.anitabi.cn')

    const manifest = await skills.read(entry!)
    expect(manifest.verified).toBe(true)
    expect(manifest.body).toContain('search_animate_subject')
    expect(manifest.body).toContain('不要编造坐标')
    expect(manifest.body).toContain('originURL')
    expect(manifest.body).not.toContain('/bangumi/')
  })
})
