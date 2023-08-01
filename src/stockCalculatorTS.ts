const testFlag = true;

const transactions = testFlag ? require('./../tests/data/testTransactions.json') : require('./../transactions.json');
const stock = require('./../stock.json');

enum TransactionTypeEnum {
  Refund = 'refund',
  Order = 'order',
}

type Transaction = {
  type: TransactionTypeEnum;
  sku: string;
  qty: number;
}

type StockItem = {
  sku: string;
  stock: number;
}


function updateStockQty(initialItemQuantity: number, matchingTransactions: Transaction[]): number {
  let updatedItemQuantity = initialItemQuantity;

  matchingTransactions.forEach(transaction => {
    switch (transaction.type) {

      case TransactionTypeEnum.Order:
        updatedItemQuantity -= transaction.qty;
        break;

      case TransactionTypeEnum.Refund:
        updatedItemQuantity += transaction.qty;
        break;

      default:
        console.log('Invalid transaction type');

    }
  });

  return updatedItemQuantity;
}

export const processSku = (sku: string): Promise<{ sku: string, qty: number }> => {
  return new Promise((resolve, reject) => {

    console.log(`\nStarting calculation for: ${sku}`);

    const stockItem: StockItem | undefined = stock.find((item: StockItem) => item.sku === sku);

    const matchingTransactions: Transaction[] = transactions.filter((item: Transaction) => item.sku === sku);

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
