const axios = require("axios");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");
const Errors = require("../errors");
const {
  FunctionNames,
  WalletMessages,
  AdminMessages,
  GenericConstants,
} = require("../constants");

class MonovaService {
  async getBankAccountStatus(bankAccountNumber) {
    try {
      const config = executeAxiosConfig(FunctionNames.getBankAccountStatus, {
        bankAccountNumber: bankAccountNumber,
      });

      const bankAccountStatusRes = await axios(config);
      return bankAccountStatusRes;
    } catch (err) {
      throw new Errors.InternalServerError(
        WalletMessages.BANK_ACCOUNT_STATUS_FAILURE,
        {
          error: err?.response?.data,
          functionName: FunctionNames.getBankAccountStatus,
        }
      );
    }
  }
  async createBankAccount(user) {
    try {
      const config = executeAxiosConfig(FunctionNames.createBankAccount, {
        bankAccountName: user.bankAccountTitle
          ? user.bankAccountTitle
          : user.firstName + " " + user.lastName,
        clientUniqueId: user.id,
        isActive: true,
      });

      const resp = await axios(config);

      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(WalletMessages.CREATE_BANK_FAILED, {
        error: err?.response?.data,
        userId: user?.id || null,
        functionName: FunctionNames.createBankAccount,
      });
    }
  }
  async getWithdrawBankAccountBalance() {
    try {
      const config = executeAxiosConfig(FunctionNames.withdrawBalance);
      const resp = await axios(config);
      if (resp.status === 200 && resp.data) return resp.data;
      else return null;
    } catch (err) {
      if (err?.response && err?.response.data) return err?.response.data;
      else return null;
    }
  }
  async getDepositBankAccountBalance() {
    try {
      const config = executeAxiosConfig(FunctionNames.depositBalance);
      const resp = await axios(config);
      if (resp.status === 200 && resp.data) return resp.data;
      else return null;
    } catch (err) {
      if (err?.response && err?.response.data) return err?.response.data;
      else return null;
    }
  }
  async unclearTransactionByDate(startDate, endDate) {
    try {
      const config = executeAxiosConfig(
        FunctionNames.unclearTransactionByDate,
        { startDate: startDate, endDate: endDate }
      );

      const unclearTransactions = await axios(config);
      return unclearTransactions;
    } catch (err) {
      return err;
    }
  }
  async createDirectCredit(withdraw, wallet) {
    try {
      const config = executeAxiosConfig(FunctionNames.createDirectCredit, {
        withdraw,
        wallet,
      });
      const resp = await axios(config);
      if (resp && resp.data && resp.data.status === GenericConstants.OK) {
        return { code: 200, data: resp.data };
      } else {
        return {
          code: 400,
          data: resp?.data || {},
          message:
            resp.data && resp.data.statusDescription
              ? resp.data.statusDescription
              : AdminMessages.DIRECT_CREDIT_ERROR,
        };
      }
    } catch (error) {
      return {
        code: 500,
        data:
          error && error.response && error.response.data
            ? error.response.data
            : {},
        message:
          error.response &&
          error.response.data &&
          error.response.data.statusDescription
            ? error.response.data.statusDescription
            : AdminMessages.DIRECT_CREDIT_ERROR,
      };
    }
  }
}
module.exports = { MonovaService };
