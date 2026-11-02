import { describe, expect, it } from 'vitest'
import { getLiteBangumi, getPointDetails, searchBangumiSubject } from '../src/api'

const live = process.env.ANITABI_LIVE === '1'

describe.skipIf(!live)('live api', () => {
  it('loads a known lite subject', async () => {
    const result = await getLiteBangumi('115908')
    expect(result.id).toBe(115908)
    expect(result.litePoints.length).toBeGreaterThan(0)
  }, 30_000)

  it('loads point details', async () => {
    const result = await getPointDetails('126461')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]?.originURL).toBeTruthy()
  }, 30_000)

  it('searches bangumi', async () => {
    const result = await searchBangumiSubject('ユーフォニアム', 3)
    expect(result.list.length).toBeGreaterThan(0)
    expect(result.list.length).toBeLessThanOrEqual(3)
  }, 30_000)
})
