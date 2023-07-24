const fs = require('fs').promises;


async function readJsonFile(filePath) {
    try {
        const JSONdata = await fs.readFile(filePath, 'utf8');
        
        try{
            const data = JSON.parse(JSONdata);
            return data;
        }
        catch (error){
            //console.error(`Error parsing the JSON: ${error}`);
            throw error;
        }
        
    } catch (error) {
        //console.error(`Error reading file from disk: ${error}`);
        throw error;
    }
}


function processSku(sku, stock, transactions) {
    return new Promise((resolve, reject) => {
        // Find the matching stock item
        let stockItem = stock.find(item => item.sku === sku);

        // Find all matching transactions
        let matchingTransactions = transactions.filter(item => item.sku === sku);
    
        // If a matching stock item was found and there are transactions, do the computation
        if (matchingTransactions.length > 0) {
            let originalStock = 0;

            if(stockItem){
                originalStock = stockItem.stock;
            }
            else{
                console.log('Transactions found for absent stock, defaulting to 0');
            }

            console.log(`Original stock: ${originalStock}`);

            for(let transaction of matchingTransactions) {
                // Perform your computation here.
                if (transaction.type === 'order') {
                    //console.log(`Ordered: ${transaction.qty}`);
                    originalStock -= transaction.qty;
                }
                else if (transaction.type === 'refund') {
                    //console.log(`Returned: ${transaction.qty}`);
                    originalStock += transaction.qty;
                }
            }
            // Once all computations are done, resolve the promise
            resolve({ sku: sku, qty: originalStock });
        } else {
            reject(`No matching stock item or transactions found for SKU ${sku}`);
        }
    });
}


function calculateStock(sku) {
    return Promise.all([readJsonFile('./stock.json'), readJsonFile('./transactions.json')])
    .then(([stock, transactions]) => {
        return processSku(sku, stock, transactions);
    })
    .catch(error => {
        throw error;
    });
}

const SKUs = ["CLQ274846/07/46","INVALIDSKU/00/00", "SXB930757/87/87", "UTF434696/37/18", "JSZ454994/85/17"];

for(let s of SKUs) {
    calculateStock(s).then(result => console.log(result)).catch(error => console.log('Error:', error));
}
