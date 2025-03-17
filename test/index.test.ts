import { describe, expect } from 'vitest'
import { getLiteBangumi } from '../src/api'

describe('[getLiteBangumi] response success', async () => {
  const result = await getLiteBangumi('428735')
  expect(result.id).toEqual(428735)
})
