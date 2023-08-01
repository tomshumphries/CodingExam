const { processSku } = require('./../dist/stockCalculator');



test('JS: ensure processSku works correctly when stock is not found, but transactions are', async () => {
  const result = processSku('SKU/2')

  expect(result).resolves.toEqual({ qty: 5, sku: 'SKU/2' });
})


test('JS: ensure processSku works correctly when stock is found, but transactions for that stock are not found', async () => {
  const result = processSku('CLQ274846/07/46')

  expect(result).resolves.toEqual({ qty: 8414, sku: 'CLQ274846/07/46' });
})

test('JS: ensure processSku works correctly when SKU is present in both stock and transactions', async () => {
  const result = processSku('MRP846986/84/16')

  expect(result).resolves.toEqual({ qty: 2679, sku: 'MRP846986/84/16' });
})

test('JS: ensure processSku throws an error when an errornous sku is provided', async () => {
  const result = processSku('Not/A/Sku')

  expect(result).rejects.toMatch('No matching stock item or transactions found for SKU Not/A/Sku');
})



//["CLQ274846/07/46","INVALIDSKU/00/00", "SXB930757/87/87", "UTF434696/37/18", "JSZ454994/85/17"];