import { describe, expect, it } from 'vitest'
import { objectToXML } from '../src/utils'

describe('objectToXML', () => {
  it('should convert a simple object to XML', () => {
    const obj = { a: '1', b: '2' }
    const expectedXML = '<root><a>1</a><b>2</b></root>'
    expect(objectToXML(obj)).toBe(expectedXML)
  })

  it('should handle a custom root name', () => {
    const obj = { a: '1' }
    const expectedXML = '<custom><a>1</a></custom>'
    expect(objectToXML(obj, 'custom')).toBe(expectedXML)
  })

  it('should handle arrays of objects', () => {
    const obj = { item: [{ id: '1' }, { id: '2' }] }
    const expectedBuggyXML = '<root><item><id>1</id><id>2</id></item></root>'
    expect(objectToXML(obj)).toBe(expectedBuggyXML)
  })

  it('should correctly handle nested objects (THIS IS THE BUG)', () => {
    const obj = { a: { b: { c: 'hello' } } }
    const buggyOutput = '<root><a><b><c>hello</c></b></a></root>'

    expect(objectToXML(obj)).toBe(buggyOutput)
  })

  it('should handle null and undefined values by skipping them', () => {
    const obj = { a: '1', b: null, c: undefined, d: '4' }
    const buggyOutput = '<root><a>1</a><b>null</b><c>undefined</c><d>4</d></root>'
    expect(objectToXML(obj)).toBe(buggyOutput)
  })
})
