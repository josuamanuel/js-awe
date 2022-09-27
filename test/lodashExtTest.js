import { strict as assert } from 'assert'

import { wildcardToRegExp, cloneCopy, promiseAll, } from '../src/lodashExt.js'
import { traverse, getValueAtPath, setValueAtPath } from '../src/jsUtils.js'
import clone from 'just-clone'

describe('lodashExt', () => {

  //getValueAtPath()
  const getValueAtPathSubject = {
    house:
    {
      room: [
        {
          table: {},
          wardrove: {
            jean: 'green',
            sweatter: 'red'
          },
          bed: [
            'doubleBed', 'singleBed', 'queenBed'
          ],
          draw: {
            jean: 'green',
            sweatter: 'red'
          },
        },
        {
          bed: [
            'doubleBed', 'singleBed'
          ]
        },
        {}
      ]
    }
  }

  it('getValueAtPath', () => {
    const actual = getValueAtPath(getValueAtPathSubject, 'house.room.0.wardrove')
    assert.deepStrictEqual(
      actual,
      {
        jean: 'green',
        sweatter: 'red'
      }
    )
  })

  it('getValueAtPath: To get root inform path empty', () => {

    //Arrange
    //subject
    const subject = 3
    //expected
    const expected = 3

    //Act
    const actual = getValueAtPath(3, '')
    //Assert
    assert.strictEqual(actual, expected)

  })


  //setValueAtPath()
  const setValueAtPathSubject = {
    house:
    {
      room: [
        {
          table: {},
          wardrove: {
            jean: 'green',
            sweatter: 'red'
          },
          bed: [
            'doubleBed', 'singleBed', 'queenBed'
          ],
          draw: {
            jean: 'green',
            sweatter: 'red'
          },
        },
        {
          bed: [
            'doubleBed', 'singleBed'
          ]
        },
        {}
      ]
    }
  }

  it('setValueAtPath', () => {

    //Arrange
    //subject
    const subject = clone(setValueAtPathSubject)
    //expected
    const expected = clone(setValueAtPathSubject)
    expected.house.room[0].wardrove = { test: 'mytest' }

    //act
    let actual = subject
    setValueAtPath(actual, 'house.room.0.wardrove', { test: 'mytest' })

    //assert
    assert.deepStrictEqual(actual, expected)

  })


  it('setValueAtPath', () => {
    //Arrange
    //subject
    const subject = clone(setValueAtPathSubject)
    //expected
    const expected = clone(setValueAtPathSubject)
    expected.house.room[4] = {}
    expected.house.room[4].wardrove = { test: 'mytest' }

    //Act
    let actual = subject
    setValueAtPath(actual, 'house.room.4.wardrove', { test: 'mytest' })

    //Assert
    assert.deepStrictEqual(subject, expected)

  })



  it('setValueAtPath simple test with arrays', () => {
    //Arrange
    //subject
    const subject = []
    //expected
    const expected = []
    expected[4] = []
    expected[4][4] = []
    expected[4][4][4] = 'myTest'

    //Act
    let actual = subject
    setValueAtPath(actual, '4.4.4', 'myTest')

    //Assert
    assert.deepStrictEqual(actual, expected)

  })

  it('setValueAtPath complex', () => {

    //Arrange
    //subject
    const subject = clone(setValueAtPathSubject)
    //expected
    const expected = clone(setValueAtPathSubject)
    expected.house.room[4] = []
    expected.house.room[4][4] = {}
    expected.house.room[4][4].wardrove = { test: 'mytest' }

    //Act
    let actual = subject
    setValueAtPath(actual, 'house.room.4.4.wardrove', { test: 'mytest' })

    //Assert
    assert.deepStrictEqual(actual, expected)

  })

  //wildcardToRegExp
  it('wildcardToRegExp', () => {

    //Arrange
    //subject
    const subject = '**.0.wardrove'
    //expected
    const expected = new RegExp('^.*\\.0\\.wardrove$')

    //Act
    const actual = wildcardToRegExp(subject)

    //Assert
    assert.deepStrictEqual(actual, expected)
  })

  it('wildcardToRegExp with flags', () => {

    //Arrange
    //subject
    const subject = '**.0.wardrove'
    const subjectFlags = 'gim'
    //expected
    const expected = new RegExp('^.*\\.0\\.wardrove$', 'mig')

    const actual = wildcardToRegExp(subject, subjectFlags)

    assert.deepStrictEqual(actual, expected)

  })

  const toEscapeChars = ['.', '+', '-', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\']

  const toTestChars = toEscapeChars.concat('_', '<', '<<', '>>', '#')


  toTestChars.map(sep => {

    const wildcardSubject = []
    const strToTestSubject = []
    const expected = []

    wildcardSubject[0] = `*${sep}antonio${sep}joseMarin${sep}**`
    strToTestSubject[0] = `pepe${sep}antonio${sep}joseMarin${sep}ruben${sep}eliodoro`
    expected[0] = true


    wildcardSubject[1] = `**${sep}antonio${sep}joseMarin${sep}*`
    strToTestSubject[1] = `pepe${sep}antonio${sep}joseMarin${sep}ruben`
    expected[1] = true


    wildcardSubject[2] = `**${sep}antonio${sep}joseMarin${sep}**`
    strToTestSubject[2] = `pepe${sep}antonio${sep}antonio${sep}joseMarin${sep}ruben${sep}eliodoro`
    expected[2] = true

    wildcardSubject[3] = `**antonio${sep}joseMarin`
    strToTestSubject[3] = `antonio${sep}joseMarin`
    expected[3] = true

    wildcardSubject[4] = `*${sep}antonio${sep}joseMarin`
    strToTestSubject[4] = `pepe${sep}antonio${sep}joseMarin`
    expected[4] = true

    wildcardSubject[5] = `antonio${sep}joseMarin${sep}**`
    strToTestSubject[5] = `antonio${sep}joseMarin${sep}ruben${sep}eliodoro`
    expected[5] = true

    //false
    wildcardSubject[6] = `*${sep}antonio${sep}joseMarin${sep}**`
    strToTestSubject[6] = `pepe${sep}toomuch${sep}antonio${sep}joseMarin${sep}ruben${sep}eliodoro`
    expected[6] = false

    wildcardSubject[7] = `**${sep}antonio${sep}joseMarin${sep}*`
    strToTestSubject[7] = `pepe${sep}raul${sep}antonio${sep}joseMarin${sep}ruben${sep}toomuch`
    expected[7] = false

    wildcardSubject[8] = `**${sep}antonio${sep}joseMarin${sep}**`
    strToTestSubject[8] = `pepe${sep}antonioantonio${sep}joseMarin${sep}ruben${sep}eliodoro`
    expected[8] = false

    wildcardSubject[9] = `**antonio${sep}joseMarin${sep}**`
    strToTestSubject[9] = `whateverwillworkhereantonio${sep}joseMarinbutnot${sep}here`
    expected[9] = false

    wildcardSubject[10] = `*${sep}antonio${sep}joseMarin`
    strToTestSubject[10] = `pepe${sep}antonio${sep}joseMarin${sep}toomuch`
    expected[10] = false

    wildcardSubject[11] = `antonio${sep}joseMarin${sep}**`
    strToTestSubject[11] = `antonio${sep}joseMarin`
    expected[11] = false


    wildcardSubject.map((wildcardStr, index) => {

      const partialActual = wildcardToRegExp(wildcardStr, undefined, sep)

      it(`wildcardToRegExp with separator: ${sep} test: ${strToTestSubject[index]} against: ${wildcardStr} that produced: ${partialActual.source}`, () => {

        const actual = partialActual.test(strToTestSubject[index])
        assert.strictEqual(actual, expected[index])

      })

    })
  })

  const wildcardToRegExpSubject = {
    house:
    {
      room: [
        {
          table: {},
          wardrove: {
            jean: 'green',
            sweatter: 'red'
          },
          bed: [
            'doubleBed', 'singleBed', 'queenBed'
          ],
          draw: {
            jean: 'blue',
            sweatter: 'red'
          },
        },
        {
          bed: [
            'doubleBed', 'singleBed'
          ]
        },
        {}
      ]
    }
  }

  it('wildcardToRegExp and traverse together', () => {

    const extract = []
    const regexPath = wildcardToRegExp('**.0.*.jean')

    traverse(wildcardToRegExpSubject, (obj, path) => {
      if (path.join('.').match(regexPath) !== null) extract.push(obj)
    })

    assert.deepStrictEqual(extract, ['green', 'blue'])

  })

  // cloneCopy
  it('cloneCopy complex object clean=true and shallow=false', (done) => {
    //Arrange
    const obj = {
      a: 8,
      b: {
        c: 4,
        d: 5
      },
      c: 8
    }

    const to = { placeholder: 'it will be deleted' }

    //Action
    cloneCopy(to, obj, true, false)

    //Assert
    assert.deepStrictEqual(to, obj)
    done()

  })

  // promiseAll
  it('promiseAll with complex Object', (done) => {
    //Arrange
    //subject
    const subject = {
      a: 8,
      b: Promise.resolve(
        Promise.resolve(
          {
            c: 4,
            d: Promise.resolve({ e: { f: 9 } })
          }
        )),
      g: 8
    }

    const expected = {
      a: 8,
      b: {
        c: 4,
        d: { e: { f: 9 } }
      },
      g: 8
    }

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.deepStrictEqual(actual, expected)
      done()
    }

    //If exception the assert is always KO
    function cbKO(e) {
      assert.fail(`expected: ${expected}, but failed with exeception: ${e}`)
    }

  })

  it('promiseAll with primitive value', (done) => {
    //Arrange
    //subject
    const subject = 8
    //expected
    const expected = 8

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.deepStrictEqual(actual, expected)
      done()
    }

    //If exception the assert is always KO
    function cbKO(e) {
      assert.fail(`expected ${expected}, but failed with exeception: ${e}`)
    }

  })

  it('promiseAll with Promise in Root that resolves to a primitive', (done) => {
    //Arrange
    //subject
    const subject = Promise.resolve(8)
    //expected
    const expected = 8

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.deepStrictEqual(actual, expected)
      done()
    }

    //If exception the assert is always KO
    function cbKO(e) {
      assert.fail(`Failed with exeception: ${e}`)
    }

  })

  it('promiseAll with Promise in Root that rejects', (done) => {
    //Arrange
    //subject
    const subject = Promise.reject(new Error('rejected intentionally for testing'))
    //expected
    const expected = 'rejected intentionally for testing'

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.fail(`actual: ${actual}, but expected exception with message: ${expected}`)

    }

    //If exception the assert is always KO
    function cbKO(actual) {
      assert.deepStrictEqual(actual.message, expected)
      done()
    }

  })


  it('promiseAll with object without promises', (done) => {
    //Arrange
    //subject
    const subject = { a: { b: { c: 8 }, d: 9 } }
    //expected
    const expected = { a: { b: { c: 8 }, d: 9 } }

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.deepStrictEqual(actual, expected)
      done()
    }

    //If exception the assert is always KO
    function cbKO(e) {
      assert.fail(`expected: ${expected}, but failed with exeception: ${e}`)
    }

  })


  it('promiseAll with complex Object and resolve in root', (done) => {

    //Arrange
    //subject
    const subject = Promise.resolve({
      a: 8,
      b: Promise.resolve(
        Promise.resolve(
          {
            c: 4,
            d: Promise.resolve({ e: { f: Promise.resolve(9) } })
          }
        )),
      g: 8
    })

    const expected = {
      a: 8,
      b: {
        c: 4,
        d: { e: { f: 9 } }
      },
      g: 8
    }

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.deepStrictEqual(actual, expected)
      done()
    }

    //If exception the assert is always KO
    function cbKO(e) {
      assert.fail(`actual: ${expected}, but failed with exeception: ${e}`)
    }

  })

  it('promiseAll with complex Object that reject internally.', (done) => {

    //Arrange
    //subject
    const subject = Promise.resolve({
      a: 8,
      b: Promise.resolve(
        Promise.resolve(
          {
            c: 4,
            d: Promise.resolve({ e: { f: Promise.reject(new Error('this fail as for the test')) } })
          }
        )),
      g: 8
    })

    const expected = 'this fail as for the test'

    //Action
    promiseAll(subject).then(cbOK).catch(cbKO)

    //Assert
    function cbOK(actual) {
      assert.fail(`actual: ${actual}, but expected exception with message: ${expected}`)

    }

    //If exception the assert is always KO
    function cbKO(actual) {
      assert.deepStrictEqual(actual.message, expected)
      done()
    }

  })


})


