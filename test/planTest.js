import { strict as assert } from 'assert'
import { EnumMap, Enum, formatDate, CustomError, findDeepKey, traverse } from '../src/jsUtils.js'
import pkg from 'lodash';
const { cloneDeep, isObjectLike } = pkg;

// describe('jsUtils', () => {

//   it('CustomError name property', () => {
//     const result = new CustomError('MY_ERROR', 'this is my error')

//     assert.strictEqual(result.name, 'MY_ERROR')


//   })
// })

// TEST: Unblock until end to test

import { plan } from '../src/plan.js'
import {  R, RLog, innerRightJoinWith } from '../src/ramdaExt.js'
import {  fork, resolve } from 'fluture'

const logFork = message => fork(
  error =>RLog(message + ' - Error: ')(JSON.stringify(error))
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
  return resolve(bankDB.holdings[customer])
}

function getCreditCardBalances(data) {
  return resolve(
    data.creditCardsToFetch.map(
      card => ({account:card, ...bankDB.balancesCreditCards[card]})
    )
  )
}

function getBankingBalances(data)
{ 
  return resolve(
    data.bankingToFetch.map(
      account => ({account, ...bankDB.balancesBanking[account]})
    )
  )
}

// App logic


let filterActiveAccounts = R.filter(R.prop('active'))


let buildPlaceholderStructure = R.reduce( 
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
)


function mergeCardsAndAccountsInArray([bankingData, creditData])
{
  return [...bankingData, ...creditData]
}

function rightJoinFetchVsResultPlaceholder2([leftRow, rightRow]) {
  return innerRightJoinWith(
      (leftRow, rightRow) => leftRow.account === rightRow.account,
      (key, leftField, rightField) => rightField ?? leftField
    )(leftRow)(rightRow)
}

function composeNameAndHolders2([holdings, name])       
{
  return {
    name,
    holdings
  }
}


const plan4 = 
[                                               // [ 0 ]
  getCustomerData,                               // [ 0, 0 ]
  //RLog('-2--> '),                              
  [                                             // [ 0, 1 ]
    R.prop('holdings'),                         // [ 0, 1, 0 ]   
    filterActiveAccounts,                       // [ 0, 1, 1 ]
    RLog('-1--> '),                             // [ 0, 1, 2 ]
    buildPlaceholderStructure,                  // [ 0, 1, 3 ]
    RLog('0--> '),                               // [ 0, 1, 4 ]
    [                                           // [ 0, 1, 5 ]
      [                                        // [ 0, 1, 5, 0 ]
        getBankingBalances,                     // [ 0, 1, 5, 0, 0 ]
      ],       
      [                                         // [ 0, 1, 5, 1 ]
        getCreditCardBalances,                 // [ 0, 1, 5, 1, 0 ]
      ],    // [ 0, 1, 3, 1, 0 ]
      RLog('3--> '),                            // [ 0, 1, 5, 2 ]                         // [ 0, 1, 3, 3 ]
      mergeCardsAndAccountsInArray              // [ 0, 1, 5, 3 ]
    ],                                          
    [                                          // [ 0, 1, 6 ]
      RLog('3.5-> '),                          // [ 0, 1, 6, 0 ]
      R.prop('resultPlaceholder')               // [ 0, 1, 6, 1 ]
    ],
    RLog('4--> '),                             // [ 0, 1, 7 ]
    rightJoinFetchVsResultPlaceholder2,       // [ 0, 1, 6, 8 ]
    RLog('5--> ')
  ],
  [
    R.prop('name')
  ],
  RLog('6--> '),
  composeNameAndHolders2,
]

console.time('plan4-1')
const plan4Fun = plan(
  plan4
)
plan4Fun
  ('f1') //?
 .pipe(logFork('Final result plan4: '))
console.timeEnd('plan4-1')
