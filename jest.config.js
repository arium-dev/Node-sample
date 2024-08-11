module.exports = {
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/client",
    "tests/api/admin/admin/getAdmins.test.js",
    "tests/api/admin/admin/createAdmin.test.js",
    "tests/api/admin/admin/updateAdmin.test.js",
    "tests/api/admin/admin/updateProfile.test.js",
    "tests/api/admin/admin/manageSuspension.test.js",
    "tests/api/admin/admin/deleteAdmin.test.js",
    "tests/api/admin/admin/verify2FA.test.js",
    "tests/api/admin/admin/reset2FA.test.js",
    "tests/api/admin/admin/getProfile.test.js",
    "tests/api/admin/admin/disable2FA.test.js",
    "tests/api/admin/admin/verifyReset2FA.test.js",
    "tests/api/admin/admin/sendVerificationMail.test.js",
    "tests/api/admin/admin/changePassword.test.js",
    "tests/api/admin/apiKeys",
    "tests/api/admin/activities",
    "tests/api/auth/checkEmailStatus.test.js",
    "tests/api/auth/enableTwoFa.test.js",
    "tests/api/auth/enableTwoFaAndLogin.test.js",
    "tests/api/auth/forgetPassword.test.js",
    "tests/api/auth/generate2FA.test.js",
    "tests/api/auth/login.test.js",
    "tests/api/auth/logout.test.js",
    "tests/api/auth/register.test.js",
    "tests/api/auth/verify2fa.test.js",
    "tests/api/auth/verifyTwoFaAndLogin.test.js",
    "tests/api/user/dashboard/getAllCoins.test.js",
    "tests/api/user/dashboard/getBalance.test.js",
    "tests/api/user/dashboard/getCoins.test.js",
    "tests/api/user/dashboard/getCryptoBalance.test.js",
    "tests/api/user/dashboard/getLatestTrades.test.js",
    "tests/api/user/dashboard/getProfile.test.js",
    "tests/api/user/fiatWithdrawal/createFiatWithdrawal.test.js",
    "tests/api/user/fiatWithdrawal/getFiatWithdrawal.test.js",
    "tests/api/user/profile/changeEmail.test.js",
    "tests/api/user/profile/changePassword.test.js",
    "tests/api/user/profile/getProfile.test.js",
    "tests/api/user/profile/getResetTwoFA.test.js",
    "tests/api/user/profile/updateProfile.test.js",
    "tests/api/user/profile/verifyAndResetTwoFA.test.js",
    "tests/api/user/profile/verifyCurrentPassword.test.js",
    "tests/api/user/trade/buyAssetTrade.test.js",
    "tests/api/user/trade/sellAssetTrade.test.js",
    "tests/api/user/trade/withdrawCryptoTrade.test.js",
    "tests/api/user/banks/addWithdrawalBank.test.js",
    "tests/api/user/banks/generateDepositBank.test.js",
    "tests/api/user/banks/getUserDepositBankDetails.test.js",
    "tests/api/user/banks/getUserWithdrawalBankDetails.test.js",
    "tests/api/user/activity/getActivity.test.js",
    "tests/api/user/activity/getLogs.test.js",
    "tests/api/user/transactionHistory/getBuyAsset.test.js",
    "tests/api/user/transactionHistory/getFiatDeposit.test.js",
    "tests/api/user/transactionHistory/getSellAsset.test.js",
    "tests/api/user/transactionHistory/getWithdrawCrypto.test.js",
    "tests/api/webhooks/fireBlockExchange/updateWithdrawCryptoWebhook.test.js",
    "tests/api/webhooks/monoova/dedPaymentsWebhook.test.js",
    "tests/api/webhooks/monoova/idcPaymentsWebhook.test.js",
    "tests/api/webhooks/monoova/nppPaymentsWebhook.test.js",
    "tests/api/webhooks/monoova/priPaymentsWebhook.test.js",
    "tests/api/webhooks/sumSub/updateKycStatusWebhook.test.js",
    "tests/api/auth/confirmation.test.js",
    "tests/api/admin/reserveHistory",
    "tests/api/admin/rollingHistory",
    "tests/api/auth/resetPassword.test.js",
    "tests/api/admin/userLogs",
    "tests/api/admin/users/getUsers.test.js",
    "tests/api/admin/users/getDeposits.test.js",
    "tests/api/admin/users/getWithdraws.test.js",
    "tests/api/admin/users/sendVerificationMail.test.js",
    "tests/api/admin/users/getUser.test.js",
    "tests/api/admin/users/manageSuspension.test.js",
    "tests/api/admin/users/createUser.test.js",
    "tests/api/admin/users/updateUser.test.js",
    "tests/api/admin/users/verifyEddStatus.test.js",
    "tests/api/admin/users/createUpdateContactEmail.test.js",
    "tests/api/admin/users/resetPassword.test.js",
    "tests/api/admin/users/fetchActivities.test.js",
    "tests/api/admin/users/createBankAccount.test.js",
    "tests/api/admin/users/resetBankAccount.test.js",
    "tests/api/admin/coins/getCoinsList.test.js",
    "tests/api/admin/coins/activation.test.js",
    "tests/api/admin/coins/updateCoinFactor.test.js",
    "tests/api/admin/coins/coinsHistory.test.js",
    "tests/api/admin/coins/rollingReserve.test.js",
    "tests/api/admin/rollingReserve/rollingReserve.test.js",
    "tests/api/admin/rollingReserve/addRollingReserve.test.js",
    "tests/api/admin/swiftPayments/getSwiftPayments.test.js",
    "tests/api/admin/swiftPayments/updateSwiftPayments.test.js",
    "tests/api/admin/trades/fetchTrades.test.js",
    "tests/api/admin/trades/generateTradesCSV.test.js",
    "tests/api/admin/trades/updateBuyAssetTrade.test.js",
    "tests/api/admin/transactions/getBalances.test.js",
    "tests/api/admin/transactions/getDeposits.test.js",
    "tests/api/admin/transactions/generateDepositCSV.test.js",
    "tests/api/admin/transactions/getPendingDeposits.test.js",
    "tests/api/admin/transactions/generatePendingDepositCSV.test.js",
    "tests/api/admin/transactions/sendEmailForDeposit.test.js",
    "tests/api/admin/transactions/addNotesToDeposit.test.js",
    "tests/api/admin/transactions/addVideoLink.test.js",
    "tests/api/admin/transactions/getWithdrawals.test.js",
    "tests/api/admin/transactions/dashboardDetails.test.js",
    "tests/api/admin/transactions/pendingDepositsWithdraws.test.js",
    "tests/api/admin/transactions/getTransactionChart.test.js",
    "tests/api/admin/transactions/updateDeposit.test.js",
    "tests/api/admin/withdrawals/getBatchWithdrawals.test.js",
    "tests/api/admin/withdrawals/getTransactionView.test.js",
    "tests/api/admin/withdrawals/getUsers.test.js",
    "tests/api/admin/withdrawals/createBatchWithdrawal.test.js",
    "tests/api/admin/withdrawals/updateBatchWithdrawal.test.js",
    "tests/api/admin/withdrawals/getBatchWithdrawalById.test.js",
    "tests/api/admin/withdrawals/deleteWithdrawal.test.js",
    "tests/api/admin/withdrawals/updateBatchWithdrawStatus.test.js",
  ],
};
