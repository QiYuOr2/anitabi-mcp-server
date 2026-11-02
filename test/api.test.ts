import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLiteBangumi, getPointDetails, searchBangumiSubject } from '../src/api'
import { formatLite, formatPointDetails, formatSearch } from '../src/format'

const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

afterEach(() => {
  fetchMock.mockReset()
})

describe('api client', () => {
  it('parses lite payloads that no longer include point coordinates', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      id: 115908,
      cn: '吹响吧！上低音号',
      title: '響け！ユーフォニアム',
      city: '宇治市',
      cover: 'https://image.anitabi.cn/bangumi/115908.jpg?plan=h160',
      color: '#02a7bd',
      geo: [34.907, 135.806],
      zoom: 12.3,
      modified: 1784018373338,
      litePoints: [{
        id: 'qys7fu',
        cn: '京都音乐厅',
        name: '京都コンサートホール',
        image: 'https://image.anitabi.cn/points/115908/qys7fu.jpg?plan=h160',
        ep: 1,
        s: 1,
        origin: 'Google Maps',
        originURL: 'https://example.test/map',
      }],
      pointsLength: 388,
      imagesLength: 388,
    }))

    const result = await getLiteBangumi('115908')
    expect(result.id).toBe(115908)
    expect(result.litePoints[0]?.geo).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.anitabi.cn/bangumi/115908/lite',
      expect.objectContaining({ headers: expect.any(Object) }),
    )

    const formatted = formatLite(result, 'https://anitabi.cn/map?bangumiId=115908')
    expect(formatted.points[0]).toMatchObject({
      id: 'qys7fu',
      origin: 'Google Maps',
      imageHd: 'https://image.anitabi.cn/points/115908/qys7fu.jpg?plan=h360',
    })
    expect(formatted.map).toContain('bangumiId=115908')
  })

  it('rejects a bad subject id before requesting', async () => {
    await expect(getLiteBangumi('abc')).rejects.toThrow('subject id 必须是数字')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('throws when point details are empty', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    await expect(getPointDetails('383803')).rejects.toThrow('未找到该作品的地标，请检查 subject id 是否正确')
  })

  it('pages point details without requiring geo', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 'a', name: '甲', image: 'https://image.anitabi.cn/a.jpg?plan=h160', ep: 1, s: 2, origin: 'Google Maps', originURL: 'https://example.test/a' },
      { id: 'b', name: '乙', ep: 2, s: 3 },
    ]))

    const result = await getPointDetails(126461, { haveImage: true })
    expect(result).toHaveLength(2)
    const page = formatPointDetails(result, {
      id: '126461',
      mapUrl: 'https://anitabi.cn/map?bangumiId=126461',
      limit: 1,
      offset: 1,
    })
    expect(page.total).toBe(2)
    expect(page.returned).toBe(1)
    expect(page.points[0]?.id).toBe('b')
  })

  it('searches with max_results and compacts the payload', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      results: 2,
      list: [
        { id: 1, url: 'https://bgm.tv/subject/1', type: 2, name: 'A', name_cn: '甲', summary: '', air_date: '2015-04-07', air_weekday: 2 },
        { id: 2, url: 'https://bgm.tv/subject/2', type: 2, name: 'B', name_cn: '', summary: '', air_date: '', air_weekday: 0 },
      ],
    }))

    const result = await searchBangumiSubject('  响け  ', 1)
    const called = String(fetchMock.mock.calls[0]?.[0])
    expect(called).toContain('max_results=1')
    expect(called).toContain('type=2')
    expect(formatSearch(result, 1)).toEqual({
      total: 2,
      returned: 1,
      subjects: [{ id: 1, name: 'A', nameCn: '甲', airDate: '2015-04-07', url: 'https://bgm.tv/subject/1' }],
    })
  })

  it('surfaces http failures', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'missing' }, 404))
    await expect(getLiteBangumi('1')).rejects.toThrow('未找到该作品，请检查 subject id')
  })

  it('names a connect timeout instead of a bare fetch failure', async () => {
    const cause = Object.assign(new Error('Connect Timeout Error'), { code: 'UND_ERR_CONNECT_TIMEOUT', name: 'ConnectTimeoutError' })
    fetchMock.mockRejectedValueOnce(Object.assign(new TypeError('fetch failed'), { cause }))
    await expect(getLiteBangumi('1')).rejects.toThrow('连接超时，请稍后重试')
  })
})
