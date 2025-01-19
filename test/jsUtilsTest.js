import { strict as assert } from 'assert'
import {
  EnumMap,
  Enum,
  sorterByPaths,
  formatDate,
  addDays,
  subtractDays,
  diffInDaysYYYY_MM_DD,
  previousDayOfWeek,
  CustomError,
  findDeepKey,
  traverse,
  traverseVertically,
} from '../src/jsUtils.js'
import clone from 'just-clone'

describe('jsUtils', () => {
  it('CustomError name property', () => {
    const result = new CustomError('MY_ERROR', 'this is my error')

    assert.strictEqual(result.name, 'MY_ERROR')
  })

  it('CustomError message property', () => {
    const result = new CustomError('MY_ERROR', 'this is my error')

    assert.strictEqual(result.message, 'this is my error')
  })

  const daysOfWeek = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  }

  it('EnumMap check first element of new EnumMap', () => {
    const result = new EnumMap(daysOfWeek)
    assert.strictEqual(result.SUNDAY, 0)
  })

  it('EnuMap check second-last of new EnumMap', () => {
    const result = new EnumMap(daysOfWeek)
    assert.strictEqual(result.FRIDAY, 5)
  })

  it('EnumMap check last element of new EnumMap', () => {
    const result = new EnumMap(daysOfWeek)
    assert.strictEqual(result.SATURDAY, 6)
  })

  it('EnumMap check exception element not found', () => {
    let ex

    try {
      const result = new EnumMap(daysOfWeek)
      result.MONDAYlOl
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_OUT_OF_RANGE')
  })

  it('EnumMap cannot be modified', () => {
    let ex

    try {
      const result = new EnumMap(daysOfWeek)
      result['MONDAY'] = 7
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_NOT_MODIFIABLE')
  })

  it('EnumMap cannot add a new constant after being created', () => {
    let ex

    try {
      const result = new EnumMap(daysOfWeek)
      result['THEIGHT'] = 7
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_NOT_MODIFIABLE')
  })

  it('check first element of new EnumMap and using invert', () => {
    const result = new EnumMap(daysOfWeek).invert()
    assert.strictEqual(result[0], 'SUNDAY')
  })

  const typeOfFood = {
    apple: 'fruit',
    salmon: 'fish',
    seabas: 'fish',
    beef: 'meet',
    lamb: 'meet',
    orange: 'fruit',
    pig: 'meet',
  }

  it('EnumMap invert with repetition', () => {
    const result = new EnumMap(typeOfFood).invert()
    assert.deepStrictEqual(result.meet, 'pig')
  })

  it('EnumMap invert with repetition not modifieble', () => {
    const result = new EnumMap(typeOfFood).invert()

    let ex

    try {
      result.fish = 'jose'
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_NOT_MODIFIABLE')
  })

  it('Enum Test case ', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    assert.strictEqual(result.SUNDAY, true)
    assert.strictEqual(result.TUESDAY, false)
  })

  it('Enum Test case. I can change values', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    result.MONDAY = true
    assert.strictEqual(result.MONDAY, true)
    assert.strictEqual(result.SUNDAY, false)
  })

  it('Enum Test case. I can obtain the current value with getValue()', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    result.MONDAY = true
    assert.strictEqual(result.getValue(), 'MONDAY')
  })

  it('Enum Test case throwing an exception. ENUM values not allowed to be reserved words in ENUM', () => {
    let ex, result

    try {
      result = new Enum(['whatever', 'getValue', 'andanother', 'get', 'set'])
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_INVALID_ENUM_VALUE')
  })

  it('Enum Test case throwing an exception invalid property', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    let ex
    try {
      result.MONDAYlOl
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_INVALID_PROPERTY')
  })

  it('Enum Test case of a simple throwing an exception with value different than true', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    let ex
    try {
      result.MONDAY = 'TUESDAY'
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_ACTIVATION_NO_TRUE')
  })

  it('Enum Test case. throwing an exception invalid property', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    let ex
    try {
      result.MONDAYltr = true
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_INVALID_PROPERTY')
  })

  it('Enum sevaral activations', () => {
    const result = new Enum([
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ])

    assert.strictEqual(result.SUNDAY, true)

    result.TUESDAY = true

    assert.strictEqual(result.SUNDAY, false)
    assert.strictEqual(result.TUESDAY, true)
  })

  it('Enum with Transitions with rules bad format.. SPEEDRT not registered in enum', () => {
    let ex
    try {
      const result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED'], {
        UNDEFINED: ['START'],
        START: ['SPEED', 'BREAK', 'STOP'],
        SPEEDRT: ['BREAK', 'STOP'],
      })
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_RULES_BAD_FORMAT')
  })

  it('Enum with Transitions with rules bad format.. an attribute doesnt exist', () => {
    let ex
    try {
      const result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED'], {
        UNDEFINED: ['START'],
        SSDSD: [],
        SPEED: ['BREAK', 'STOP'],
      })
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_RULES_BAD_FORMAT')
  })

  it('Enum with Transitions with rules bad format.. one of the values in the the rule doesnt exist', () => {
    let ex
    try {
      const result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED'], {
        UNDEFINED: ['START'],
        START: ['START', 'TRTRTR'],
        SPEED: ['BREAK', 'STOP'],
      })
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_RULES_BAD_FORMAT')
  })

  it('Enum with Transitions with rules bad format.. one of the values in the the rule is not an array', () => {
    let ex
    try {
      const result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED'], {
        UNDEFINED: ['START'],
        START: ['START'],
        SPEED: { 0: 'BREAK', 1: 'STOP' },
      })
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_RULES_BAD_FORMAT')
  })

  it('Enum with Transitions with rules. Value can go to itself just only if it is defined for that', () => {
    let ex
    let result
    try {
      result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED', 'VANISH'], {
        UNDEFINED: ['UNDEFINED', 'START'],
        START: ['SPEED', 'BREAK', 'STOP'],
        SPEED: ['BREAK', 'STOP'],
      })

      result.UNDEFINED = true
      result.UNDEFINED = true
      result.START = true
      result.SPEED = true
    } catch (e) {
      ex = e
    }

    assert.strictEqual(result.SPEED, true)
    assert.strictEqual(ex, undefined)

    ex = ''
    try {
      result.SPEED = true
    } catch (e) {
      ex = e
    }
    assert.strictEqual(ex.name, 'ENUM_TRANSITION_NOT_ALLOWED')
  })

  it('Enum with Transitions', () => {
    const result = new Enum(['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP', 'ABANDONED'], {
      UNDEFINED: ['START'],
      START: ['SPEED', 'BREAK', 'STOP'],
      SPEED: ['SPEED', 'BREAK', 'STOP'],
      BREAK: ['SPEED', 'STOP'],
      STOP: ['START', 'ABANDONED'],
      ABANDONED: [],
    })

    assert.strictEqual(result['UNDEFINED'], true)

    let ex
    try {
      result.START = false
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_ACTIVATION_NO_TRUE')
    result.START = true
    assert.strictEqual(result.START, true)

    ex = ''
    try {
      result.ABANDONED = true
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_TRANSITION_NOT_ALLOWED')

    ex = ''
    try {
      result.START = true
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_TRANSITION_NOT_ALLOWED')

    result.SPEED = true
    assert.strictEqual(result.SPEED, true)
    result.SPEED = true
    assert.strictEqual(result.SPEED, true)

    result.STOP = true
    assert.strictEqual(result.SPEED, false)
    assert.strictEqual(result.STOP, true)
    result.ABANDONED = true
    assert.strictEqual(result['ABANDONED'], true)

    ex = ''
    try {
      result.START = true
    } catch (e) {
      ex = e
    }

    assert.strictEqual(ex.name, 'ENUM_TRANSITION_NOT_ALLOWED')
  })

  it('sorterByPaths ASC by default', () => {
    assert.deepEqual(
      [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b')),
      [{a:{b:2}}, {a:{b:3}}, {a:{b:4}}, {a:{b:5}}]
    )
  })

  it('sorterByPaths with DESC', () => {
    assert.deepEqual(
      [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths(['a.b'], false)),
      [{a:{b:5}}, {a:{b:4}}, {a:{b:3}}, {a:{b:2}}]
    )
  })

  it('sorterByPaths multiple paths', () => {
    assert.deepEqual(
      [{a:{b:5}}, {a:{b:3,c:2}}, {a:{b:3,c:1}}, {a:{b:4}}].sort(sorterByPaths(['a.b','a.c'])),
      [{a:{b:3,c:1}}, {a:{b:3,c:2}}, {a:{b:4}}, {a:{b:5}}]
    )
  })

  it('sorterByPaths with undefined', () => {
    assert.deepEqual(
      [{a:3},{a:4},{a:undefined},{a:2},{a:1},{a:undefined},{a:0},{a:undefined}].sort(sorterByPaths('a')),
      [{a:0},{a:1},{a:2},{a:3},{a:4},{a:undefined},{a:undefined},{a:undefined}]
    )
  })

  it('formatDate YYYY-MM-DD...', () => {
    assert.strictEqual(
      formatDate(
        '$YYYY-$MM-$DDT$hh:$mm:$ss.$milZ, $dayOfWeek $D of $month',
        new Date(2020, 12 - 1, 9, 23, 21, 45, 999)
      ),
      '2020-12-09T23:21:45.999Z, Wednesday 9 of December'
    )
  })

  it('formatDate new Date, $YYYY$MM$DD$hh$mm$ss$mil', () => {
    assert.strictEqual(
      formatDate('$YYYY$MM$DD$hh$mm$ss$mil', new Date(2020, 12 - 1, 9, 23, 21, 45, 999)),
      '20201209232145999'
    )
  })

  it('addDays', () => {
    assert.strictEqual(
      addDays(3, new Date('2023-03-24')).toISOString(),
      new Date('2023-03-27').toISOString()
    )
  })

  it('subtractDays', () => {
    assert.strictEqual(
      subtractDays(3, new Date('2023-03-27')).toISOString(),
      new Date('2023-03-24').toISOString()
    )
  })

  it('diffInDaysYYYY_MM_DD', () => {
    assert.strictEqual(diffInDaysYYYY_MM_DD('2023-02-27', '2023-03-02'), 3)
  })

  it('previousDayOfWeek requested Saturday being on Sunday, return yestarday', () => {
    assert.strictEqual(
      previousDayOfWeek(6, new Date('2023-03-19')).toISOString(),
      new Date('2023-03-18').toISOString()
    )
  })

  it('previousDayOfWeek return the same date when the input date is the day of the week requested', () => {
    assert.strictEqual(
      previousDayOfWeek(0, new Date('2023-03-19')).toISOString(),
      new Date('2023-03-19').toISOString()
    )
  })

  it('previousDayOfWeek return the same date when the input date is the day of the week requested', () => {
    assert.strictEqual(
      previousDayOfWeek(4, new Date('2023-03-16')).toISOString(),
      new Date('2023-03-16').toISOString()
    )
  })

  it('previousDayOfWeek requested Thursday being on Sunday, return previous Thursday', () => {
    assert.strictEqual(
      previousDayOfWeek(4, new Date('2023-03-19')).toISOString(),
      new Date('2023-03-16').toISOString()
    )
  })

  it('previousDayOfWeek. requested Wednesday being on Monday, it returns the requested day of the previous week', () => {
    assert.strictEqual(
      previousDayOfWeek(3, '2023-03-20').toISOString(),
      new Date('2023-03-15').toISOString()
    )
  })

  it('previousDayOfWeek. You can use string date format', () => {
    assert.strictEqual(
      previousDayOfWeek(4, '2023-03-19').toISOString(),
      new Date('2023-03-16').toISOString()
    )
  })


  const findDeepKeyObjSubject = {
    house: {
      room: [
        {
          table: {},
          wardrove: {
            jean: 'green',
            sweatter: 'red',
          },
          bed: ['doubleBed', 'singleBed', 'queenBed'],
          draw: {
            jean: 'green',
            sweatter: 'red',
          },
        },
        {
          bed: ['doubleBed', 'singleBed'],
        },
        {},
      ],
    },
  }

  it('findDeepKey multiple values', () => {
    const result = findDeepKey(findDeepKeyObjSubject, 'bed')
    assert.deepStrictEqual(result, [
      ['house', 'room', '0', 'bed'],
      ['doubleBed', 'singleBed', 'queenBed'],
      ['house', 'room', '1', 'bed'],
      ['doubleBed', 'singleBed'],
    ])
  })

  it('findDeepKey. key doesnt exist', () => {
    const result = findDeepKey(findDeepKeyObjSubject, 'xRxR')
    assert.deepStrictEqual(result, [])
  })

  it('findDeepKey root node', () => {
    const result = findDeepKey(findDeepKeyObjSubject, 'house')
    assert.deepStrictEqual(result, [['house'], findDeepKeyObjSubject.house])
  })

  //traverse()
  const subjectBase = {
    house: {
      room: [
        {
          table: {},
          wardrove: {
            jean: 'green',
            sweatter: 'red',
          },
          bed: ['doubleBed', 'singleBed', 'queenBed'],
          draw: {
            jean: 'green',
            sweatter: 'red',
          },
        },
        {
          bed: ['doubleBed', 'singleBed'],
        },
        {},
        {
          bed: [],
        },
      ],
    },
  }

  it('traverse with reviver', () => {
    //Arrange
    //subject
    const subject = clone(subjectBase)
    //expected
    const expected = clone(subjectBase)
    expected.house.room[0].wardrove.jean = 'red'

    //Act
    const actual = traverse(subject, (obj, path) => {
      if (path.join('.') === '$.house.room.0.wardrove.jean') {
        return 'red'
      }
    })

    //Assert
    assert.deepStrictEqual(actual, expected)
  })

  it('traverse with several conditions and null', () => {
    //Arrange
    //subject
    const subject = clone(subjectBase)
    //expected
    const expected = clone(subjectBase)
    expected.house.room[1].bed = null
    expected.house.room[0].wardrove.jean = 'red'

    //Act
    const actual = traverse(subject, (obj, path) => {
      if (path.join('.') === '$.house.room.0.wardrove.jean') {
        return 'red'
      }

      if (path.join('.') === '$.house.room.1.bed') {
        return null
      }
    })

    //Assert
    assert.deepStrictEqual(actual, expected)
  })

  it('traverse with stop stopping the change to null', () => {
    //Arrange
    //subject
    const subject = clone(subjectBase)
    //expected
    const expected = clone(subjectBase)
    expected.house.room[0].wardrove.jean = 'red'

    //Act
    const actual = traverse(subject, (obj, path) => {
      if (path.join('.') === '$.house.room.0.wardrove.jean') return 'red'
      if (path.join('.') === '$.house.room.1.bed') return null
      if (path.join('.') === '$.house.room.1') return traverse.stop
    })

    //Assert
    assert.deepStrictEqual(actual, expected)
  })

  it('traverse with skip stopping a change but continue with other changes', () => {
    //Arrange
    //subject
    const subject = clone(subjectBase)
    //expected
    const expected = clone(subjectBase)
    expected.house.room[0].wardrove.jean = 'red'
    expected.house.room[2] = 'nothing'

    const actual = traverse(subjectBase, (obj, path) => {
      if (path.join('.') === '$.house.room.0.wardrove.jean') return 'red'
      if (path.join('.') === '$.house.room.1.bed') return null
      if (path.join('.') === '$.house.room.2') return 'nothing'
      if (path.join('.') === '$.house.room.1') return traverse.skip
    })

    assert.deepStrictEqual(actual, expected)
  })

  it('traverse to extract data by keys', () => {
    let extract = []
    const actual = traverse(subjectBase, (obj, path) => {
      if (path.join('.') === '$.house.room.0.wardrove.jean') extract.push(path.join('.'), obj)
      if (path.join('.') === '$.house.room.1.bed') extract.push(path.join('.'), obj)
      if (path.join('.') === '$.house.room.2') extract.push(path.join('.'), obj)
    })

    assert.deepStrictEqual(extract, [
      '$.house.room.0.wardrove.jean',
      'green',
      '$.house.room.1.bed',
      ['doubleBed', 'singleBed'],
      '$.house.room.2',
      {},
    ])
  })

  it('traverse to extract data and use stop', () => {
    let extract = []
    const actual = traverse(subjectBase, (obj, path) => {
      if (path.join('.') === '$.house.room.0') return traverse.stop
      if (path[path.length - 1] === 'bed') extract.push(obj)
    })

    assert.deepStrictEqual(extract, [])
  })

  it('traverse to extract data and use skip', () => {
    let extract = []
    const actual = traverse(subjectBase, (obj, path) => {
      if (path.join('.') === '$.house.room.0') return traverse.skip
      if (path[path.length - 1] === 'bed') extract.push(obj)
    })

    assert.deepStrictEqual(extract, [['doubleBed', 'singleBed'], []])
  })

  it('traverse to extract data and use of two skips', () => {
    let extract = []
    const actual = traverse(subjectBase, (obj, path) => {
      if (path.join('.') === '$.house.room.1') return traverse.skip
      if (path.join('.') === '$.house.room.3') return traverse.skip
      if (path[path.length - 1] === 'bed') extract.push(obj)
    })

    assert.deepStrictEqual(extract, [['doubleBed', 'singleBed', 'queenBed']])
  })

  it('traverse to delete data', () => {
    const actual = traverse(subjectBase, (obj, path) => {
      if (Array.isArray(obj)) return traverse.delete
    })

    assert.deepStrictEqual(actual, {
      house: {
        room: undefined,
      },
    })
  })

  //traverseVertically()
  const subjectTV = [
    {
      name: 'apple',
      avge: [
        {
          date: '2022-01-01',
          close: 22.1,
        },
        {
          date: '2022-01-02',
        },
      ],
      hist: [
        {
          date: '2022-01-01',
          close: 22.1,
        },
        {
          date: '2022-01-02',
        },
      ],
    },
    {
      name: 'microsoft',
      avge: [
        {
          date: '2022-01-01',
          close: 22.1,
        },
        {
          date: '2022-01-02',
        },
      ],
      hist: [
        {
          date: '2022-01-01',
        },
        {
          date: '2022-01-02',
        },
        {
          date: '2022-01-03',
          close: 99,
        },
      ],
    },
  ]

  it('traverseVertically a complex array', () => {
    let calledWithIndex = []
    traverseVertically(
      (verticalSlice, runIndex) => {
        calledWithIndex[runIndex] = true
        if (runIndex === 0) {
          assert.deepEqual(verticalSlice, [
            {
              name: 'apple',
              avge: { date: '2022-01-01', close: 22.1 },
              hist: { date: '2022-01-01', close: 22.1 },
            },
            {
              name: 'microsoft',
              avge: { date: '2022-01-01', close: 22.1 },
              hist: { date: '2022-01-01' },
            },
          ])
        }

        if (runIndex === 1) {
          assert.deepEqual(verticalSlice, [
            {
              name: 'apple',
              avge: { date: '2022-01-02' },
              hist: { date: '2022-01-02' },
            },
            {
              name: 'microsoft',
              avge: { date: '2022-01-02' },
              hist: { date: '2022-01-02' },
            },
          ])
        }

        if (runIndex === 2) {
          assert.deepEqual(verticalSlice, [
            {
              name: 'apple',
              avge: undefined,
              hist: undefined,
            },
            {
              name: 'microsoft',
              avge: undefined,
              hist: { date: '2022-01-03', close: 99 },
            },
          ])
        }
      },
      ['avge', 'hist'],
      subjectTV
    )

    assert.deepEqual(
      calledWithIndex,
      [true, true, true],
      'Index for false values indicates that functionToRun was omitted and over run'
    )
  })

  it('traverseVertically an undefined object', () =>
    traverseVertically(
      () => {
        assert.fail('It should not have called functionToRun')
      },
      ['result'],
      undefined
    ))

  it('traverseVertically an empty array', () =>
    traverseVertically(
      () => {
        assert.fail('It should not have called functionToRun')
      },
      ['result'],
      []
    ))

  it('traverseVertically an array with all vertical fields not being arrays', () =>
    traverseVertically(
      () => {
        assert.fail('It should not have called functionToRun')
      },
      ['result'],
      [{ result: 12 }]
    ))

  it('traverseVertically an array with null, empty objects, and one that has a vertical field match', () => {
    let wasCalled = false
    traverseVertically(
      (verticalSlice, runIndex) => {
        if (runIndex === 0) {
          wasCalled = true
          assert.deepEqual(verticalSlice, [
            { hist: undefined, avge: undefined },
            { hist: undefined, avge: undefined },
            { avge: undefined, hist: undefined },
            { hist: undefined, avge: undefined },
            { name: 'apple', hist: 12, avge: undefined },
          ])
        }
      },
      ['hist', 'avge'],
      [{}, { hist: undefined }, { avge: [] }, null, { name: 'apple', hist: [12] }]
    )

    if (wasCalled === false) assert.fail('It should have called functionToRun passed as argument')
  })
})
