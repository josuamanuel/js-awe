import { R } from './../ramdaExt.js'
import { Text } from './components/text.js'

const Index = Symbol()

function Table(data) {
  let tableData

  if(Array.isArray(data)) {
    tableData = data.map((row, index) => {
      if(typeof row === 'object') return {[Index]: index, ...row}
      else return {[Index]: index}
    })
  }

  if(typeof data === 'object' && Array.isArray(data) === false) {
    tableData = Object.entries(data).map(([key, value]) => {
      if(typeof value === 'object') return {[Index]: key, ...value}
      else return value = {[Index]: key}
    })
  }
  
  const VERTICAL_LINE_CHAR = '│'
  const TOP_LEFT_CORNNER_CHAR = '┌'
  const TOP_RIGHT_CORNNER_CHAR = '┐'
  const TOP_COLUMN_SEPARATOR_CHAR = '┬'
  const BOTTON_LEFT_CORNNER_CHAR = '└'
  const BOTTON_RIGHT_CORNNER_CHAR = '┘'
  const BOTTON_COLUMN_SEPARATOR_CHAR = '┴'
  const HORIZONTAL_LINE_CHAR = '─'
  const MIDDLE_COLUMN_SEPARATOR_CHAR = '┼'
  const MIDDLE_LEFT_SEPARATOR = '├'
  const MIDDLE_RIGHT_SEPARATOR = '┤'
  const COLUMN_LEFT_MARGIN_CHARS = ' '
  const COLUMN_RIGHT_MARGIN_CHARS = ' '
  const TABLE_LEFT_MARGIN_CHARS = ''
  const MARGINS_AND_VERTICAL_LINE_SIZE =
    COLUMN_LEFT_MARGIN_CHARS.length + COLUMN_RIGHT_MARGIN_CHARS.length + VERTICAL_LINE_CHAR.length

  const listOfColumns = []

  let horLine

  function getTopLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1 ? TOP_COLUMN_SEPARATOR_CHAR : TOP_RIGHT_CORNNER_CHAR),
      TABLE_LEFT_MARGIN_CHARS + TOP_LEFT_CORNNER_CHAR
    )
  }

  function getBottonLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1
          ? BOTTON_COLUMN_SEPARATOR_CHAR
          : BOTTON_RIGHT_CORNNER_CHAR),
      TABLE_LEFT_MARGIN_CHARS + BOTTON_LEFT_CORNNER_CHAR
    )
  }

  function getDownTableLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1 ? MIDDLE_COLUMN_SEPARATOR_CHAR : MIDDLE_RIGHT_SEPARATOR),
      TABLE_LEFT_MARGIN_CHARS + MIDDLE_LEFT_SEPARATOR
    )
  }

  function linesOfData(section) {
    let allValuesAreDone
    let lines = []
    let isFirstRow = true
    let values = {}
    // Each iteration is a row in the table.
    // first row is used to initialize the generator function for each column.
    // So then we can extract each row with next()
    do {
      allValuesAreDone = true

      const aLine = listOfColumns.reduce((line, component, index) => {
        if (isFirstRow) {
          values[index] = component[section].nextValue()
        }
        const { value: columnValue, done } = values[index].next()
        if (done !== true) allValuesAreDone = false

        let valueCellPadded = COLUMN_LEFT_MARGIN_CHARS +
          (columnValue ?? component.getUndefinedRepresentation()) +
          COLUMN_RIGHT_MARGIN_CHARS

        //if(component.getSize() > valueCellPadded.length)
        //  valueCellPadded = valueCellPadded.padEnd(component.getSize() + 2, COLUMN_RIGHT_MARGIN_CHARS)

        return (
          line +
          valueCellPadded +
          VERTICAL_LINE_CHAR
        )
      }, TABLE_LEFT_MARGIN_CHARS + VERTICAL_LINE_CHAR)

      if (allValuesAreDone === false) lines.push(aLine)
      isFirstRow = false
    } while (allValuesAreDone === false)

    return lines
  }

  function draw() {
    listOfColumns.forEach((column) => column.load(R.pluck(column.id)(tableData)))

    const lines = [
      // Top Line
      getTopLine(),
      // Heading line
      ...linesOfData('heading'),
      // Down Line of Heading
      getDownTableLine(),
      // detail lines
      ...linesOfData('row'),
      // botton line of the table
      getBottonLine(),
    ]

    return lines.join('\n')
  }

  function addColumn({ type, id, title }) {
    let column = type.loadParams(id)(title??id)
    listOfColumns.push(column)
    return {
      addColumn,
      draw
    }
  }

  function auto() {
    tableData.map((row) => {
        Object.keys(row).map((id) => {
          if(listOfColumns.find((el) => el.id === id) === undefined)
            addColumn({type: Text(), id})
        })
    })

    return { draw }
  }

  return {
    addColumn,
    auto
  }
}

export { Table, Index }
