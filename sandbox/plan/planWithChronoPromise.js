
import { plan  } from '../../src/plan.js'
import { Chrono } from '../../src/chrono.js'
import { RLog, R, innerRightJoinWith } from '../../src/ramdaExt.js'
import { sleepWithValue } from '../../src/jsUtils.js'

//import { fork, after, map, mapRej } from 'fluture'

const logFork = message => fork(
  error =>RLog(message + ' - Error: ')(error)
)(
  response =>RLog(message + ' - OK: ')(response)
)

const bankDB = {
  holdings: {
    'f1': {
      name: 'Jose Marin',
      holdings: [
        {
          account:'1',
          uuid:'u1',
          active:false,
          prod:'300'
        },
        {
          account:'2',
          uuid:'u2',
          prod:'300',
          active: true
        },
        {
          account:'3',
          uuid:'u3',
          prod:'500',
          active: true
        }
      ]
    }
  },
  balancesBanking: {
    '2': {
      current: 12,
      available: 35
    }
  },
  balancesCreditCards: {
    '3': {
      current: 8,
      available: 1975
    }
  }
}


// Services
function getCustomerData(customer){
  return sleepWithValue(130, bankDB.holdings[customer])
}

function getCreditCardBalances(data) {
  return sleepWithValue(
    150,
    data.creditCardsToFetch.map(
      card => ({account:card, ...bankDB.balancesCreditCards[card]})
    )
  )
}

function getBankingBalances(data)
{ 
  return sleepWithValue(
    230,
    data.bankingToFetch.map(
      account => ({account, ...bankDB.balancesBanking[account]})
    )
  )
}

// App logic


let filterActiveAccounts = R.filter(R.prop('active'))


let buildPlaceholderStructure = (data) => R.reduce( 
  (acc, el) => {
    acc.resultPlaceholder.push({ account:el.account, uuid:el.uuid })
    if(el.prod === '300') acc.bankingToFetch.push(el.account)
    if(el.prod === '500') acc.creditCardsToFetch.push(el.account)
    
    return acc
  },
  //placeholderStructure
  {
    resultPlaceholder:[],
    bankingToFetch:[],
    creditCardsToFetch:[]
  },
)(data)


function mergeCardsAndAccountsInArray([bankingData, creditData])
{
  return [...bankingData, ...creditData]
}

function rightJoinFetchVsResultPlaceholder([leftRow, rightRow]) {
  return innerRightJoinWith(
      (leftRow, rightRow) => leftRow.account === rightRow.account,
      (key, leftField, rightField) => rightField ?? leftField
    )(leftRow)(rightRow)
}

function composeNameAndHolders([holdings, name])       
{
  return {
    name,
    holdings
  }
}

let chrono = Chrono()


const productInformationPlan = 
[                
  chrono.setTimeEnd('plan'),                          
  chrono.setTime('getCustomerData'),
  getCustomerData,                                  
  chrono.setTimeEnd('getCustomerData'),                     
  [                                          
    chrono.setTime('preparingPlaceholder'),
    R.prop('holdings'),                      
    filterActiveAccounts,                      
    buildPlaceholderStructure,                  
    chrono.setTimeEnd('preparingPlaceholder'),
    [                                           
      [         
        chrono.setTime('getBankingBalances'),                                

        getBankingBalances,                     
        chrono.setTimeEnd('getBankingBalances'),
      ],       
      [                                         
        chrono.setTime('getCreditCardBalances'),                                
        getCreditCardBalances,                 
        chrono.setTimeEnd('getCreditCardBalances'),                               
      ],                                        
      chrono.setTime('dataProcessing'),                                          
      mergeCardsAndAccountsInArray             
    ],                                          
    [                                           
      R.prop('resultPlaceholder')              
    ],
    rightJoinFetchVsResultPlaceholder,        
  ],
  [
    R.prop('name')
  ],
  composeNameAndHolders,
]

chrono.time('plan')
const planFun = plan(
  productInformationPlan
)

planFun
  ('f1')
.then(chrono.setTimeEnd('dataProcessing'))
.then(chrono.logReport)
.then((OK)=>console.log('OK: ', OK), (error)=>console.log('Error: ', error))


