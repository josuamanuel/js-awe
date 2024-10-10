import { strict as assert } from 'assert'
import { filterMap } from '../src/ramdaExt.js'

describe('ramdaExt.js', () => {

  it('Happy path filterMap', () => {
    const input = [0,1,7,3,4,5,9]
    const expected = [14,54]

    const filterValueGreatThanIndex = (el, index)=> el > index
    const mapValueByIndex = (el,index)=> el*index
    const result = filterMap(filterValueGreatThanIndex, mapValueByIndex, input)
    
    assert.deepStrictEqual(result, expected)
  })
})
