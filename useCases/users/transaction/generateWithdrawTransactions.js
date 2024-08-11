const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  batchesLookup,
  walletLookup,
  fetchWithdrawTransactionsAddFields,
  fetchWithdrawTransactionsProject,
} = require("../../../utils/searches");
const { GenericConstants } = require("../../../constants");

async function generateWithdrawTransactions(id, { transactionRepository }) {
  const pipeline = [
    { $match: { type: GenericConstants._WITHDRAW } },
    { $match: { userId: new ObjectId(id) } },
    batchesLookup,
    walletLookup,
    { $unwind: "$batchDetails" },
    { $unwind: "$walletDetails" },
    fetchWithdrawTransactionsAddFields,
    fetchWithdrawTransactionsProject,
  ];

  const transactions = await transactionRepository.findByAggregation(pipeline);

  let csvFilePath = path.join(__dirname, "../../../public");
  if (!fs.existsSync(csvFilePath)) {
    fs.mkdirSync(csvFilePath);
  }

  const csvHeaders = [
    { id: "bsb", title: "BSB" },
    { id: "accountNumber", title: "Account Number" },
    { id: "amount", title: "Amount" },
    { id: "receipt", title: "Receipt" },
    { id: "status", title: "Status" },
  ];

  const csvWriter = createObjectCsvWriter({
    path: `${csvFilePath}/output.csv`,
    header: csvHeaders,
  });

  const resp = await csvWriter.writeRecords(transactions);

  return `${csvFilePath}/output.csv`;
}
module.exports = { generateWithdrawTransactions };
