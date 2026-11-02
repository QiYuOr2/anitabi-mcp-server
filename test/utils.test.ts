import { describe, expect, it } from 'vitest'
import { clampInt, objectToXML, toHdImage } from '../src/utils'

describe('objectToXML', () => {
  it('converts a flat object', () => {
    expect(objectToXML({ a: '1', b: '2' })).toBe('<root><a>1</a><b>2</b></root>')
  })

  it('uses a custom root name', () => {
    expect(objectToXML({ a: '1' }, 'custom')).toBe('<custom><a>1</a></custom>')
  })

  it('repeats tags for arrays of objects', () => {
    const obj = { item: [{ id: '1' }, { id: '2' }] }
    expect(objectToXML(obj)).toBe('<root><item><id>1</id></item><item><id>2</id></item></root>')
  })

  it('keeps nested objects', () => {
    expect(objectToXML({ a: { b: { c: 'hello' } } })).toBe('<root><a><b><c>hello</c></b></a></root>')
  })

  it('skips null and undefined', () => {
    expect(objectToXML({ a: '1', b: null, c: undefined, d: '4' })).toBe('<root><a>1</a><d>4</d></root>')
  })

  it('renders coordinate tuples instead of dropping them', () => {
    expect(objectToXML({ geo: [34.9, 135.8] })).toBe('<root><geo>34.9,135.8</geo></root>')
  })

  it('escapes text', () => {
    expect(objectToXML({ name: 'A&B <C>' })).toBe('<root><name>A&amp;B &lt;C&gt;</name></root>')
  })
})

describe('helpers', () => {
  it('clamps limits', () => {
    expect(clampInt(undefined, 8, 1, 25)).toBe(8)
    expect(clampInt(100, 8, 1, 25)).toBe(25)
    expect(clampInt(0.9, 8, 1, 25)).toBe(1)
  })

  it('upgrades thumbnail plan', () => {
    expect(toHdImage('https://image.anitabi.cn/points/1/a.jpg?plan=h160'))
      .toBe('https://image.anitabi.cn/points/1/a.jpg?plan=h360')
    expect(toHdImage('https://image.anitabi.cn/a.jpg')).toBeUndefined()
  })
})
