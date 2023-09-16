import { plan, Chrono, RLog, R, innerRightJoinWith } from 'js-awe'
import { fork, after, map, mapRej } from 'fluture'

const logFork = (message) =>
  fork((error) => RLog(message + ' - Error: ')(error))((response) =>
    RLog(message + ' - OK: ')(response)
  )

const bankDB = {
  holdings: {
    f1: {
      name: 'Jose Marin',
      holdings: [
        {
          account: '1',
          uuid: 'u1',
          active: false,
          prod: '300',
        },
        {
          account: '2',
          uuid: 'u2',
          prod: '300',
          active: true,
        },
        {
          account: '3',
          uuid: 'u3',
          prod: '500',
          active: true,
        },
      ],
    },
  },
  balancesBanking: {
    2: {
      current: 12,
      available: 35,
    },
  },
  balancesCreditCards: {
    3: {
      current: 8,
      available: 1975,
    },
  },
}

// Services
function getCustomerData(customer) {
  return after(130)(bankDB.holdings[customer])
}

function getCreditCardBalances(data) {
  return after(150)(
    data.creditCardsToFetch.map((card) => ({ account: card, ...bankDB.balancesCreditCards[card] }))
  )
}

function getBankingBalances(data) {
  return after(230)(
    data.bankingToFetch.map((account) => ({ account, ...bankDB.balancesBanking[account] }))
  )
}

// App logic

let filterActiveAccounts = R.filter(R.prop('active'))

let buildPlaceholderStructure = (data) =>
  R.reduce(
    (acc, el) => {
      acc.resultPlaceholder.push({ account: el.account, uuid: el.uuid })
      if (el.prod === '300') acc.bankingToFetch.push(el.account)
      if (el.prod === '500') acc.creditCardsToFetch.push(el.account)

      return acc
    },
    //placeholderStructure
    {
      resultPlaceholder: [],
      bankingToFetch: [],
      creditCardsToFetch: [],
    }
  )(data)

function mergeCardsAndAccountsInArray([bankingData, creditData]) {
  return [...bankingData, ...creditData]
}

function rightJoinFetchVsResultPlaceholder([leftRow, rightRow]) {
  return innerRightJoinWith(
    (leftRow, rightRow) => leftRow.account === rightRow.account,
    (key, leftField, rightField) => rightField ?? leftField
  )(leftRow)(rightRow)
}

function composeNameAndHolders([holdings, name]) {
  return {
    name,
    holdings,
  }
}

let { time, setTime, setTimeEnd, logReport } = Chrono()

const productInformationPlan = [
  setTimeEnd('plan'),
  setTime('getCustomerData'),
  getCustomerData,
  setTimeEnd('getCustomerData'),
  [
    setTime('preparingPlaceholder'),
    R.prop('holdings'),
    filterActiveAccounts,
    buildPlaceholderStructure,
    setTimeEnd('preparingPlaceholder'),
    [
      [setTime('getBankingBalances'), getBankingBalances, setTimeEnd('getBankingBalances')],
      [
        setTime('getCreditCardBalances'),
        getCreditCardBalances,
        setTimeEnd('getCreditCardBalances'),
      ],
      setTime('dataProcessing'),
      mergeCardsAndAccountsInArray,
    ],
    [R.prop('resultPlaceholder')],
    rightJoinFetchVsResultPlaceholder,
  ],
  [R.prop('name')],
  composeNameAndHolders,
]

let timeoutId

time('plan')
const planFun = plan().build(productInformationPlan)

const executeIfyouWantToCancel = planFun('f1')
  .pipe(R.map(setTimeEnd('dataProcessing')))
  .pipe(R.map(logReport))
  // We clear the timeout if it fails, otherwise node will hang and idle execution until timeout completes.
  .pipe(
    mapRej((error) => {
      clearTimeout(timeoutId)
      return error
    })
  )
  // We clear the timeout if it works, otherwise node will hang and idle execution until timeout completes.
  .pipe(
    map((data) => {
      clearTimeout(timeoutId)
      return data
    })
  )
  .pipe(logFork('Final result plan: '))

// The return of pipe(fork()()) is not a future. So IT WOULD BE WRONG TO!!!: pipe(fork()()).pipe(...
// The return is a sequence$cancel function. If you invoke it like: executeIfyouWantToCancel(), the future will
// be canceled inmediatetly. You can use this to setup a timeout function.
// Observe how we can stop execution depending on the ms we introduce:

// enough time to execute the whole plan
timeoutId = setTimeout(executeIfyouWantToCancel, 30000)

// Setting up a low value of timeout 250ms will stop in the middle of the plan execution
//setTimeout(executeIfyouWantToCancel, 250)
