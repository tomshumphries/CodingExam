You are given two json files:
 - stock.json: contains objects which represent the starting stock levels for given SKUS
 - transactions.json: contains an array of transactions since the stock levels were recorded in `stock.json`

The objective is to create a function which is able to return the current stock levels for a given SKU by combining the data in these two files. These are the requirements.

- The function must match the following signature: `(sku: string) => Promise<{ sku: string, qty: number }>`.
- The function must read from the `stock` and `transactions` files on each invocation (totals cannot be precomputed)
- The function must throw an error where the SKU does not exist in the `transactions.json` and `stock.json` file
- All code must be adequately tested
Notes:
- Transactions may exist for SKUs which are not present in `stock.json`. It should be assumed that the starting quantity for these is 0.
- Functionality can be split into many files to help keep the project clear and organised


/-----------------------------------------------------------------------------------------------------/


The solution has been presented in 2 analogous files, one javascript, one typescript.
 - The source code for TS can be found at './src/stockCalculatorTS.ts'
 - The compiled TS and the JS solution can be found at './dist/*.js'
 - Some test scripts and test data can be found in './tests/'
 - Several config files have been created in the root folder.

These solutions offer identical functionality, and have been tested using JEST tests found in the /tests folder
 - The tests operate on transactions from a new json file called 'testTransactions.json'
 - The tests focus one 4 scenarios covering the combinations of SKU's being present in:
        - Only the stock list
        - Only the transaction list
        - Both lists
        - Neither list
 - Both refund and order operations have been included in the tests.

