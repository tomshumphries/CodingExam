//set this to true if you are running JEST tests, false otherwise.
const testFlag = true;

const transactions = testFlag ? require('./../tests/data/testTransactions.json') : require('./../transactions.json');
const stock = require('./../stock.json');


function updateStockQty (initialItemQuantity, matchingTransactions) {

  let updatedItemQuantity = initialItemQuantity;

  matchingTransactions.forEach(transaction => {
    switch (transaction.type) {
      
      case 'order':
        updatedItemQuantity -= transaction.qty;
        break;

      case 'refund':
        updatedItemQuantity += transaction.qty;
        break;

      default:
        console.log('Invalid transaction type');
    }
  });

  return updatedItemQuantity;
}


module.exports.processSku = function (sku) {
  return new Promise((resolve, reject) => {

    console.log(`\nStarting calculation for: ${sku}`);

    const stockItem = stock.find(item => item.sku === sku);

    const matchingTransactions = transactions.filter(item => item.sku === sku);

    if (matchingTransactions.length > 0) {
      const initialStockQty = stockItem ? stockItem.stock : 0;
      const itemQuantity = updateStockQty(initialStockQty, matchingTransactions);

      resolve({ sku: sku, qty: itemQuantity });
    }

    if (stockItem && matchingTransactions.length === 0) {
      resolve({ sku: sku, qty: stockItem.stock });
    } 
      
    reject(`No matching stock item or transactions found for SKU ${sku}`);
  });
}



