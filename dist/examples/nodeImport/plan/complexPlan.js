import { plan } from 'js-awe'

const { build, map, identity } = plan()


const complexPlan = [
  [fetchBulkCurrentAccounts],
  [fetchAccounts,
    [identity],
    [filterSavings, pluck('id'), map(fetchSavingBalance)],
    [filterLoans, pluck('id'), map(fetchLoanBalance)],
  ],
  format,
]

const getCustomerBalances = build(complexPlan)

console.log('result: ', await getCustomerBalances('0396d9b0'))

function fetchBulkCurrentAccounts() {
  return Promise.resolve(
    [
      {
        id: 13,
        balance: 9
      },
    ]
  )
}

function filterSavings(accounts) {
  return accounts.filter((account) => account.type === 'saving')
}

function filterLoans(accounts) {
  return accounts.filter((account) => account.type === 'loan')
}

function format([fetchBulkCurrentAccounts, [accounts, savingBalances, loanBalances]]) {

  return accounts.map(account => {
    let balance
    if(account.type === 'saving') balance = savingBalances.find(savingAccount => savingAccount.id === account.id ).balance
    if(account.type === 'loans') balance = loanBalances.find(loanAccount => loanAccount.id === account.id ).balance
    if(account.type === 'current') balance = fetchBulkCurrentAccounts.find(contract => contract.id === account.id ).balance

    return {...account, balance}
  })
}

// utility functions

function pluck(key) {
  return arr => arr.map(el => el[key])
}


// Data fetch services are mocked for local running.
// In production they should be fetch APIs to real implementations.
function fetchAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
    { id: 13, type: 'current' },
  ])
}

function fetchSavingBalance(accountId) {
  return Promise.resolve(
    {
      id: accountId,
      balance: 13
    },
  )
}

function fetchLoanBalance(accountId) {
  return Promise.resolve({
      id: accountId,
      balance: 24
    })
}

export { complexPlan }