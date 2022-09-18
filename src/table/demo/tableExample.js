
import { Table } from '../table.js'
import { Text } from '../components/text.js'
import { Timeline } from '../components/timeline.js'

const timelineData = [
  {
    event: "getHoldings",
    intervals: [
      {
        start: new Date("2020-02-03T14:00:12.012Z"),
        end: new Date("2020-02-03T14:00:12.215Z"),
        //end: new Date("2020-02-03T14:00:13.215Z"),
      },
      {
        start: new Date("2020-02-03T14:00:13.000Z"),
        end: new Date("2020-02-03T14:00:13.215Z"),
      },
    ]
  },
  {
    event: "getAccounts",
    intervals: [
      {
        start: new Date("2020-02-03T14:00:12.290Z"),
        end: new Date("2020-02-03T14:00:12.800"),
      }
    ]
  },
  {
    event: "getCards",
    intervals: [
      {

        start: new Date("2020-02-03T14:00:12.288Z"),
        end: new Date("2020-02-03T14:00:13.100Z"),
      }
    ]
  },
];


const timeline = Table()

timeline.addColumn({ type: Text(), id: 'event', title: 'Events' })
timeline.addColumn({type: Text(), id: 'event', title: 'Events2'})
timeline.addColumn({ type: Timeline(), id: 'intervals' })

console.log(timeline.draw(timelineData))