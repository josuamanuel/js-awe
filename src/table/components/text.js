
import { center, left } from '../tableUtils.js'

function Text({ HEADING_IDENTATION, ROW_IDENTATION } = { HEADING_IDENTATION: center, ROW_IDENTATION: left }) {
  let size
  let id
  let title
  let data

  return {
    loadParams: paramId => paramTitle => {
      id = paramId
      title = paramTitle

      return {
        id,
        heading: {
          nextValue: function* () {
            yield HEADING_IDENTATION(title, size)
          }
        },
        row: {
          nextValue: function* () {
            for (let el of data)
              yield ROW_IDENTATION(el, size)
          }
        },
        load: columnData => {

          data = columnData
          //console.log({id, title, data})
          size = data.reduce(
            (acum, current) =>
              acum < current.length
                ? current.length
                : acum
            , 0
          )

          size = Math.max(size, title.length ?? 0)
        },
        getUndefinedRepresentation: () => ''.padEnd(size),
        getSize: () => size
      }
    }
  }
}

export { Text }
