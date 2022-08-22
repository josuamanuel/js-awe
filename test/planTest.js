import { strict as assert } from 'assert'


import { plan } from '../src/plan.js'
import { R, innerRightJoinWith } from '../src/ramdaExt.js'
import { promise, resolve } from 'fluture'

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


function buildPlaceholderStructure(data) {
  return R.reduce( 
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
}


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


const complexPlan = 
[                                               // [ 0 ]
  getCustomerData,                              // [ 0, 0 ]                           
  [                                             // [ 0, 1 ]
    R.prop('holdings'),                         // [ 0, 1, 0 ]   
    filterActiveAccounts,                       // [ 0, 1, 1 ]
    buildPlaceholderStructure,                  // [ 0, 1, 2 ]            
    [                                           // [ 0, 1, 3 ]
      [                                         // [ 0, 1, 3, 0 ]
        getBankingBalances,                     // [ 0, 1, 3, 0, 0 ]
      ],       
      [                                         // [ 0, 1, 3, 1 ]
        getCreditCardBalances,                  // [ 0, 1, 3, 1, 0 ]
      ],    
      mergeCardsAndAccountsInArray              // [ 0, 1, 3, 2 ]
    ],                                          
    [                                          // [ 0, 1, 4 ]
      R.prop('resultPlaceholder')              // [ 0, 1, 4, 0 ]
    ],
    rightJoinFetchVsResultPlaceholder2,        // [ 0, 1, 5 ]
  ],
  [
    R.prop('name')
  ],
  composeNameAndHolders2,
]


describe('plan', () => {

  it('plan expected output', () => {
    const returnTestFramework = plan(complexPlan)('f1')
    return promise(returnTestFramework)
      .then(
          (data =>  
            assert.deepStrictEqual(
              data,
              {
                name: 'Jose Marin',
                holdings: [
                  { account: '2', current: 12, available: 35, uuid: 'u2' },
                  { account: '3', current: 8, available: 1975, uuid: 'u3' }
                ]
              } 
            )
          ),
          (error => assert.fail('Future was not expected to be rejected with: ' + JSON.stringify(error)))
      )
  })

  it('Repeating the test should work as expected', () => {
    const returnTestFramework = plan(complexPlan)('f1')
    return promise(returnTestFramework)
      .then(
          (data =>  
            assert.deepStrictEqual(
              data,
              {
                name: 'Jose Marin',
                holdings: [
                  { account: '2', current: 12, available: 35, uuid: 'u2' },
                  { account: '3', current: 8, available: 1975, uuid: 'u3' }
                ]
              } 
            )
          ),
          (error => assert.fail('Future was not expected to be rejected with: ' + JSON.stringify(error)))
      )
  })

  it('plan expected output using mockups', () => {
    const returnTestFramework = 
      plan(
        complexPlan, 
        {
          numberOfThreads: Infinity,
          mockupsObj: {
            getBankingBalances: resolve([{
              account: '2',
              current: 999,
              available: 99
            }])
          }
        }
      )('f1')

    return promise(returnTestFramework)
      .then(
          (data =>  
            assert.deepStrictEqual(
              data,
              {
                name: 'Jose Marin',
                holdings: [
                  { account: '2', current: 999, available: 99, uuid: 'u2' },
                  { account: '3', current: 8, available: 1975, uuid: 'u3' }
                ]
              } 
            )
          ),
          (error => assert.fail('Future was not expected to be rejected with: ' + JSON.stringify(error)))
      )
    
  })

})