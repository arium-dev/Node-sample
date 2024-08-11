const { validationResult, check, param } = require("express-validator");
const { isEmpty } = require("lodash");
const Errors = require("../errors");
const { validate } = require("./common");
const { messages } = require("./constants");

const checkValidation = (req, _, next) => {
  const validationErrors = validationResult(req);
  if (!isEmpty(validationErrors.errors)) {
    throw new Errors.BadRequest(JSON.stringify(validationErrors.array()));
  }
  next();
};

const registerValidator = [
  validate.checkFirstName,
  validate.checkLastName,
  validate.checkDob,
  validate.checkCaptchaToken,
  validate.checkEmail,
  // validate.checkRole,
];

const loginValidator = [validate.checkEmail, validate.checkPassword];
const emailValidation = [validate.checkEmail];
const confirmUserValidator = [
  validate.checkToken,
  validate.checkPassword
    .isLength({ min: 8, max: 40 })
    .withMessage(messages.PASSWORD_LENGTH_INVALID),
  validate.checkConfirmPassword,
];
const resetValidator = [
  validate.checkToken,
  validate.checkPassword
    .isLength({ min: 8, max: 40 })
    .withMessage(messages.PASSWORD_LENGTH_INVALID),
  validate.checkConfirmPassword,
];

const verifyTwoFaValidator = [validate.checkVerificationCode, validate.checkId];

const verificationCodeValidator = [validate.checkVerificationCode];

const verifyTwoFaAndLoginKeyValidator = [
  validate.checkVerificationCode,
  validate.checkLoginKey,
];

const updateUserValidator = [
  validate.checkFirstName,
  validate.checkLastName,
  validate.checkEmail,
];

const updateAdminProfileValidator = [
  validate.checkFirstName,
  validate.checkLastName,
];

const changePasswordValidator = [
  validate.checkCurrentPassword,
  validate.checkPassword
    .isLength({ min: 8, max: 40 })
    .withMessage(messages.PASSWORD_LENGTH_INVALID),
  validate.checkConfirmPassword,
];
const verifyCurrentPasswordValidator = [validate.checkCurrentPassword];

const changeEmailValidator = [validate.checkEmail, validate.checkEmailToken];

const commonBankAccountValidator = [
  validate.checkBsb,
  validate.checkAccountNumber,
  validate.checkAccountTitle,
];

const withdrawlBankAccountValidator = [...commonBankAccountValidator];

const exchangeRateValidator = [
  validate.checkSourceCurrencyCode,
  validate.checkDestinationCurrencyCode,
];

const withdrawValidator = [validate.checkWalletId, validate.checkAmount];

const transferValidator = [
  validate.recipientId,
  validate.exchangeCurrencyId,
  validate.amount,
];

const transactionFeeValidator = [validate.feeValidator];

const validateId = [validate.checkId];

const createBatchWithDrawValidator = [
  validate.checkWithdraws,
  validate.checkWithdrawsUserId,
  validate.checkWithdrawsBsb,
  validate.checkWithdrawsAccountNumber,
  validate.checkWithdrawsAmount,
  validate.checkWithdrawsRefId,
];

const updateBatchWithDrawValidator = [
  ...createBatchWithDrawValidator,
  validate.paramId,
];

const updateStatusWithdrawalValidator = [
  validate.paramId,
  validate.checkWithdraws,
  validate.checkStatusWithdraw,
  validate.checkWithdrawsId,
  validate.checkWithdrawsStatus,
];
const userStatusValidator = [validate.checkId, validate.userStatus];

const transactionStatusValidator = [
  validate.checkId,
  validate.transactionStatus,
];

const noteValidator = [validate.note];
const linkValidator = [validate.link];

const updateUserValidation = [
  validate.checkId,
  validate.checkFirstName,
  validate.checkLastName,
  // validate.checkEmail,
];

const eddEmailValidator = [validate.checkDepositEmailStatus];

const updateDepositValidator = [
  validate.paramId,
  validate.checkStatusPendingDeposit,
];

const checkCalendlyBookValidator = [validate.checkTokenValidation];
const scheduleMeetingValidator = [
  validate.checkTokenValidation,
  validate.checkEventUrl,
];
module.exports = {
  checkValidation,
  validateId,
  emailValidation,
  loginValidator,
  registerValidator,
  confirmUserValidator,
  resetValidator,
  verifyTwoFaValidator,
  verifyTwoFaAndLoginKeyValidator,
  updateUserValidator,
  changePasswordValidator,
  verifyTwoFaValidator,
  verifyCurrentPasswordValidator,
  changeEmailValidator,
  withdrawlBankAccountValidator,
  exchangeRateValidator,
  withdrawValidator,
  transferValidator,
  transactionFeeValidator,
  userStatusValidator,
  updateAdminProfileValidator,
  createBatchWithDrawValidator,
  updateBatchWithDrawValidator,
  updateStatusWithdrawalValidator,
  verificationCodeValidator,
  transactionStatusValidator,
  noteValidator,
  linkValidator,
  updateUserValidation,
  eddEmailValidator,
  updateDepositValidator,
  checkCalendlyBookValidator,
  scheduleMeetingValidator,
};
