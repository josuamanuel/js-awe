import { strict as assert } from 'assert'


import { plan } from '../src/plan.js'
import { R, innerRightJoinWith } from '../src/ramdaExt.js'
import { promise, reject, resolve } from 'fluture'
import { CustomError } from '../src/jsUtils.js'

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

  it('if a piped function reject, the final result will be a reject with the error object', () => {
    const returnTestFramework = 
      plan(
        complexPlan, 
        {
          numberOfThreads: Infinity,
          mockupsObj: {
            getBankingBalances: reject(
              {
                "code": "400",
                "message": "bankingToFetch is empty"
              }
            )
          }
        }
      )('f1')

    return promise(returnTestFramework)
      .then(
          ()=>{},
          (error =>  
            assert.deepStrictEqual(
              error,
              {
                "code": "400",
                "message": "bankingToFetch is empty"
              }
            )
          )
      )
    
  })

  it('if a piped function return an instance of Error or subclass of Error, the final result will be a resolve with the error object', () => {
    const returnTestFramework = 
      plan(
        complexPlan, 
        {
          numberOfThreads: Infinity,
          mockupsObj: {
            getBankingBalances: new CustomError(
              'GET_BANKING_BALANCE_EXCEPTION',
              'Error getting Banking Balances',
              {
                "code": "400",
                "message": "bankingToFetch is empty"
              }
            )
          }
        }
      )('f1')

    return promise(returnTestFramework)
      .then(
          (dataError =>  
            assert.deepStrictEqual(
              Object.entries(dataError.data),
              {
                "code": "400",
                "message": "bankingToFetch is empty"
              }
            )
          ),
          ()=>{}
      )
    
  })
    
  it('Plan without promise and complex nesting', () => {
    const result= plan(
      [
        [
          [
            x => x + 1
          ],
          x => x + 1
        ],
        [
          x => x + 1 
        ],
        [
          x => x + 1
        ]
      ]
    )(1)

    assert.deepStrictEqual(
      result,
      [3,2,2]
    )
  })

  it('Plan without promise and complex nesting', () => {
    const result= plan(
      [
        [
          [ 
            [
              [
                x => x + 1
              ]
            ] 
          ],
          [
            x => x + 1
          ]
        ],
        ([x1,x2]) => x1 + x2,
        [
          x => x + 1 
        ],
        [
          x => x + 1
        ]
      ]
    )(1)

    assert.deepStrictEqual(
      result,
      [5,5]
    )
  })

  it('Plan without promise and complex nesting', () => {
    const result= plan(
      [
        [
          [ 
            [
              [
                x => x + 1
              ]
            ] 
          ],
          [
            x => x + 1
          ]
        ],
        [
          x => x + 1 
        ],
        [
          x => x + 1
        ],
        [
          x => x + 1
        ]
      ]
    )(1)

    assert.deepStrictEqual(
      result,
      [[2,2],2,2,2]
    )
  })


  it('Plan without promise and complex nesting', () => {
    const result= plan(
      [
        [
          x => x + 1 
        ],
        [
          x => x + 1 
        ],
        [
          x => x + 1 
        ],
        [
          [x => x + 1]
        ],
        [
          x => x + 1
        ]
      ]
    )(1)

    assert.deepStrictEqual(
      result,
      [2,2,2,2,2]
    )
  })


})