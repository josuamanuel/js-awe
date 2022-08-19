import { strict as assert } from 'assert'
import { sanitize, lengthSanitizer } from '../src/sanitizer.js'

describe('Sanitize an Object', () => {

  it('Happy path Value sanitizer starting with Bearer. Applying the rules for the default sanitization group', () => {
    const input = {
      body:
      {
        truken: 'bearer 123456'
      }
    }

    const expected = {
      body:
      {
        truken: 'bearer *length=6*'
      }
    }

    const result = sanitize(input)
    assert.deepStrictEqual(result, expected)
  })

  it('Happy path Value sanitizer starting with Bearer. Forcing the sanitizer group.', () => {
    const input = {
      body:
      {
        truken: 'bearer 123456'
      }
    }

    const expected = {
      body:
      {
        truken: 'bearer *length=6*'
      }
    }

    const result = sanitize(input, ['ibmApis'])
    assert.deepStrictEqual(result, expected)
  })

  it('Value rules has more precedence than field rules. Only Value rule is applied. Forcing the sanitizer group.', () => {
    const input = {
      body:
      {
        authorization: 'bearer 123456'
      }
    }

    const expected = {
      body:
      {
        authorization: 'bearer *length=6*'
      }
    }

    const result = sanitize(input, ['ibmApis'])
    assert.deepStrictEqual(result, expected)
  })

  it('Happy path field sanitizer starting with Bearer. Forcing the sanitizer group.', () => {
    const input = {
      body:
      {
        authorization: '123456'
      }
    }

    const expected = {
      body:
      {
        authorization: '*length=6*'
      }
    }

    const result = sanitize(input, ['ibmApis'])
    assert.deepStrictEqual(result, expected)
  })

  it('Two groups. Happy path: Testing sanitizer from first group', () => {
    const input = {
      body:
      {
        authorization: '1234567'
      }
    }

    const expected = {
      body:
      {
        authorization: '*length=7*'
      }
    }

    const result = sanitize(input, ['ibmApis', 'pushNotification'])
    assert.deepStrictEqual(result, expected)
  })

  it('Two groups. Happy path: Testing sanitizer from second group', () => {
    const input = {
      body:
      {
        body: '123456'
      }
    }

    const expected = {
      body:
      {
        body: '*length=6*'
      }
    }

    const result = sanitize(input, ['ibmApis', 'pushNotification'])
    assert.deepStrictEqual(result, expected)
  })

  it('Deep nesting check', () => {
    const input = {
      body:
      {
        other: {
          token: 'adsdadsasdasdasdasd',
          other: {
            fin: 'Bearer asdasdadsas',
            d: { e: 8 }
          }
        },
        body: '123456'
      }
    }

    const expected = {
      body:
      {
        other: {
          token: '*length=19*',
          other: {
            fin: 'Bearer *length=11*',
            d: { e: 8 }
          }
        },
        body: '*length=6*'
      }
    }

    const result = sanitize(input, ['ibmApis', 'pushNotification'])
    assert.deepStrictEqual(result, expected)
  })

  it('Sanitize calling with my own sanitizer definition and a pre-created sanitizer group', () => {
    const input = {
      body:
      {
        name: 'Jose Marin',
        address: '25 Melrose place',
        addressId: 2,
        customer: 'F54615234',
        date: '2022-08-19'
      }
    }

    const mySanitizer = [
      {field: 'address', replacer: lengthSanitizer},
      {field: 'name', replacer: lengthSanitizer}
    ]

    const inputListOfSanitizers = [mySanitizer, 'pushNotification']

    const expected = {
      body:
      {
        name: '*length=10*',
        address: '*length=16*',
        addressId: 2,
        customer: 'F*length=8*',
        date: '2022-08-19'
      }
    }

    const result = sanitize(input, inputListOfSanitizers)
    assert.deepStrictEqual(result, expected)
  })

})