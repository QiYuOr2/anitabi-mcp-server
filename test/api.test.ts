import { describe, expect, it } from 'vitest'
import { getLiteBangumi, getPointDetails } from '../src/api'

describe('request test', () => {
  it('[getLiteBangumi] response success', async () => {
    const result = await getLiteBangumi('428735')
    expect(result.id).toEqual(428735)
  })

  it('[getPointDetails] response success', async () => {
    const result = await getPointDetails('428735')
    expect(result.length).not.toEqual(0)
  })
})
