import { plan } from 'js-awe'

const getCustomerBalances = plan().build([
  [fetchAccounts],
  [(customerId)=>[1,2,3,4][customerId]],
  format,
])

console.log('result: ', await getCustomerBalances(0))


function format([fetchAccounts, customerId]) {
  return {fetchAccounts, customerId}
}

// Data fetch services are mocked for local running.
// In production they should be fetch APIs to real implementations.
function fetchAccounts(customerId) {
  return Promise.resolve([
    { id: 1, type: 'saving' },
    { id: 2, type: 'loan' },
  ][customerId])
}