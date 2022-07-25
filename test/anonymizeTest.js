import { strict as assert } from 'assert'
import { anonymize } from '../src/anonymize.js'

describe('Anonymize a string', () => {

  it('Happy path. Anonymized string should be same length as original', () => {
    const input = "Bearer asdasd!ss£ss"

    const expected = {
      size: 19,
    }

    const result = anonymize(input)
    assert.deepStrictEqual(result.length, expected.size)
  })

  it('Happy path. Non letters or numbers should be kept untouched', () => {
    const input = "Bearer asdasd!s s£ss"

    const result = anonymize(input)
    assert.deepStrictEqual(result[6],  ' ')
    assert.deepStrictEqual(result[13], '!')
    assert.deepStrictEqual(result[15], ' ')
    assert.deepStrictEqual(result[17], '£')
  })

  it('Happy path. If the algorithm could not changed more than half of chars then it will return same length string filled with *', () => {
    assert.deepStrictEqual(anonymize( '!*st3d  )'),  '*********')
  })

  it('Unhappy path. String that changed exactly half of the characters should not be obscured with *', () => {
    assert.notEqual(anonymize( '@&a2'),  '****')
  })
})