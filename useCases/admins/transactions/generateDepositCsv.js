const moment = require("moment");
const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const { GenericConstants, TransactionType } = require("../../../constants");

const generateDepositCsv = async ({ status = "", transactionRepository }) => {
  let condition = {
    type: TransactionType.DEPOSIT,
  };
  if (status) {
    condition = {
      ...condition,
      status,
    };
  }
  const deposits = await transactionRepository.find(condition, "userId");
  let data =
    deposits.length > 0
      ? deposits.map((d) => {
          return {
            user: d.userId
              ? `${d?.userId?.firstName} ${d?.userId?.lastName}`
              : "",
            date: d.createdAt
              ? moment(d.createdAt).format(GenericConstants.DATE_TIME_FORMAT)
              : "",
            reference: d?.lodgementRef || "",
            amount: `$${d?.amount || 0}`,
            status: d?.status || "",
          };
        })
      : [];

  let csvFilePath = path.join(__dirname, "../../../public");
  if (!fs.existsSync(csvFilePath)) {
    fs.mkdirSync(csvFilePath);
  }

  const csvHeaders = [
    { id: "user", title: "User" },
    { id: "date", title: "Date" },
    { id: "reference", title: "Reference" },
    { id: "amount", title: "Amount" },
    { id: "status", title: "Status" },
  ];

  const csvWriter = await createObjectCsvWriter({
    path: `${csvFilePath}/output.csv`,
    header: csvHeaders,
  });

  await csvWriter.writeRecords(data);

  return `${csvFilePath}/output.csv`;
};

module.exports = { generateDepositCsv };
