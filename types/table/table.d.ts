type AddColumn = ({ type, id, title }: { type: any; id: any; title: any }) => AddColumnReturn

type AddColumnReturn = {
  addColumn: AddColumn
  draw: Draw
}

type Draw = () => string

type TableReturn = {
  addColumn: AddColumn
  auto: () => { draw: Draw }
}

/**
 * stringify data in a tabular format so you can log it with:
 * console.log(Table(data).auto().draw())
 * You can use two modes. Using auto as above gives a log
 * similar to console.table(data).
 * Using addColumns you select the fields and specify the format
 * console.log(Table(data).
 *  .addColumn({ type: Text(), id: 'event', title: 'Events' })
 *  .addColumn({ type: Timeline(), id: 'intervals' }).draw())
 *  .draw())
 * @param data The data to draw in the console.
 * @returns .
 */
export function Table(data: any): TableReturn
//# sourceMappingURL=table.d.ts.map
