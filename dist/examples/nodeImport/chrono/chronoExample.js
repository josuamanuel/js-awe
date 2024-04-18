import { Chrono, sleep } from 'js-awe'

let chrono = Chrono()

chrono.time('step1')
await sleep(650)
chrono.timeEnd('step1')

await sleep(20)
chrono.time('step2')

await sleep(12)
chrono.time('step3')

await sleep(500)
chrono.timeEnd('step3')

await sleep(100)
chrono.timeEnd('step2')

await sleep(15)
chrono.time('step1')

chrono.timeEnd('step1')

chrono.report()
