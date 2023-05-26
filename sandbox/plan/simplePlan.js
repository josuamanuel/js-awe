import { plan } from '../../src/plan.js'

const getCustomerBalances = plan([
  getAccounts,
  [filterSavings, getSavingBalances],
  [filterLoans, getLoanBalances],
  formatCustomerBalances,
])

console.log(await getCustomerBalances('F12'))

function getAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
  ])
}

function filterSavings(accounts) {
  return accounts.filter((account) => account.type === 'saving')
}

function getSavingBalances(savingAccounts) {
  return Promise.resolve(savingAccounts.map((account) => ({ balance: 5, ...account })))
}

function filterLoans(accounts) {
  return accounts.filter((account) => account.type === 'loan')
}
function getLoanBalances(loanAccounts) {
  return Promise.resolve(loanAccounts.map((account) => ({ balance: 4, ...account })))
}

function formatCustomerBalances([savingBalances, loanBalances]) {
  return [...savingBalances, ...loanBalances]
}
