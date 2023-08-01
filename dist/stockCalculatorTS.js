"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSku = void 0;
const stock_json_1 = __importDefault(require("./../stock.json"));
const testTransactions_json_1 = __importDefault(require("./../tests/data/testTransactions.json"));
//import transactions from './../transactions.json';
var TransactionTypeEnum;
(function (TransactionTypeEnum) {
    TransactionTypeEnum["Refund"] = "refund";
    TransactionTypeEnum["Order"] = "order";
})(TransactionTypeEnum || (TransactionTypeEnum = {}));
function updateStockQty(itemQuantity, matchingTransactions) {
    for (let transaction of matchingTransactions) {
        if (transaction.type === TransactionTypeEnum.Order) {
            itemQuantity -= transaction.qty;
        }
        if (transaction.type === TransactionTypeEnum.Refund) {
            itemQuantity += transaction.qty;
        }
    }
    return itemQuantity;
}
const processSku = (sku) => {
    return new Promise((resolve, reject) => {
        console.log(`\nStarting calculation for: ${sku}`);
        // Find the matching stock item
        const stockItem = stock_json_1.default.find((item) => item.sku === sku);
        // Find all matching transactions
        const matchingTransactions = testTransactions_json_1.default.filter((item) => item.sku === sku);
        // If a matching transaction was found, do the computation
        if (matchingTransactions.length > 0) {
            const initialStockQty = stockItem ? stockItem.stock : 0;
            const itemQuantity = updateStockQty(initialStockQty, matchingTransactions);
            resolve({ sku: sku, qty: itemQuantity });
        }
        else if (stockItem && matchingTransactions.length === 0) {
            resolve({ sku: sku, qty: stockItem.stock });
        }
        else {
            reject(`No matching stock item or transactions found for SKU ${sku}`);
        }
    });
};
exports.processSku = processSku;
function quickTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const Skus = ["CLQ274846/07/46", "INVALIDSKU/00/00", "SXB930757/87/87", "UTF434696/37/18", "JSZ454994/85/17"];
        for (let sku of Skus) {
            yield (0, exports.processSku)(sku).then(result => console.log(result)).catch(error => console.log('Error:', error));
        }
    });
}
quickTest();
