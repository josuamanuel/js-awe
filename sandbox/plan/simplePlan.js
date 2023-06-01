import { plan } from '../../src/plan.js'

const getCustomerBalances = plan([
  fetchAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  format,
])

console.log('result: ', await getCustomerBalances('0396d9b0'))

function filterSavings(accounts) {
  return accounts.filter((account) => account.type === 'saving')
}

function getSavingBalances(savingAccounts) {
  const listOfAcccountsToFetch = savingAccounts.map((account) => account.id)
  return fetchSavingBalances(listOfAcccountsToFetch)
}

function filterLoans(accounts) {
  return accounts.filter((account) => account.type === 'loan')
}
function getLoanBalances(loanAccounts) {
  const listOfAcccountsToFetch = loanAccounts.map((account) => account.id)
  return fetchLoanBalances(listOfAcccountsToFetch)
}

function format([savingBalances, loanBalances]) {
  return [...savingBalances, ...loanBalances]
}

// Data fetch services are mocked for local running.
// In production they should be fetch APIs to real implementations.
function fetchAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
  ])
}

function fetchSavingBalances(listOfAcccountsToFetch) {
  return Promise.resolve([
    {
      id: 1,
      type: 'saving',
      balance: 13,
    },
  ])
}

function fetchLoanBalances(listOfAcccountsToFetch) {
  return Promise.resolve([
    {
      id: 2,
      type: 'loan',
      balance: 24,
    },
  ])
}
