const moment = require("moment");
const { decryptData } = require("../utils/EncryptDecrypt");
const { check, param, query } = require("express-validator");
const { messages, keys, generic, UserStatuses } = require("./constants");
const { validateUserToken } = require("../utils/calendly");

const {
  Currencies,
  TransactionStatus,
  TransactionStatuses,
  EmailStatuses,
} = require("../constants");

exports.validate = {
  paramId: param(keys.ID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.ID_REQUIRED),
  checkId: check(keys.ID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.ID_REQUIRED),
  checkFirstName: check(keys.FIRST_NAME)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.FIRST_NAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(messages.FIRST_NAME_INVALID_LENGTH),
  checkLastName: check(keys.LAST_NAME)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.LAST_NAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(messages.LAST_NAME_INVALID_LENGTH),
  checkEmail: check(keys.EMAIL)
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage(messages.EMAIL_INVALID)
    .notEmpty()
    .withMessage(messages.EMAIL_REQUIRED)
    .custom((value, { req }) => {
      if (value) {
        req.body.normalEmail = value;
      }
      return value;
    })
    .normalizeEmail(),
  checkCurrentPassword: check(keys.CURRENT_PASSWORD)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.CURRENT_PASSWORD_REQUIRED),
  checkPassword: check(keys.PASSWORD)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.PASSWORD_REQUIRED),
  checkConfirmPassword: check(keys.CONFIRM_PASSWORD)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.CONFIRM_PASSWORD_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(messages.PASSWORDS_MISMATCH);
      } else {
        return value;
      }
    }),
  checkDob: check(keys.DOB)
    .notEmpty()
    .withMessage(messages.DOB_REQUIRED)
    .custom((value) => {
      const dob = moment(value);
      const age = moment().diff(dob, generic.YEARS);
      if (age < 18) {
        throw new Error(messages.DOB_MIN_LIMIT);
      }
      if (dob.year() <= 1900) {
        throw new Error(messages.DOB_MAX_LIMIT);
      }
      return true;
    }),
  checkToken: check(keys.TOKEN).notEmpty().withMessage(messages.TOKEN_REQUIRED),
  checkCaptchaToken: check(keys.CAPTCHA_TOKEN)
    .notEmpty()
    .withMessage(messages.CAPTCHA_REQUIRED),
  checkRole: check(keys.ROLE).custom((value, { req }) => {
    if (!["user"].includes(value)) {
      throw new Error(messages.ROLE_REQUIRED);
    }
    return value;
  }),
  checkVerificationCode: check(keys.VERIFICATION_CODE)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.VERIFICATION_CODE_REQUIRED),
  checkLoginKey: check(keys.LOGIN_KEY).custom(async (value, { req }) => {
    if (value) {
      const data = await decryptData(value);
      if (data && data.id && data.password) {
        req.body = { ...req.body, ...data };
        return value;
      } else {
        throw new Error(messages.LOGIN_KEY_INVALID);
      }
    }
  }),
  checkEmailToken: check(keys.EMAIL_TOKEN)
    .trim()
    .notEmpty()
    .escape()
    .withMessage(messages.EMAIL_TOKEN_REQUIRED),

  checkBsb: check(keys.BSB)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.BSB_REQUIRED)
    .isLength({ max: 7 })
    .withMessage(messages.BSB_INVALID),
  checkAccountNumber: check(keys.ACCOUNT_NUMBER)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.BANK_ACCOUNT_NUMBER_REQUIRED),
  checkAccountTitle: check(keys.ACCOUNT_TITLE)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.BANK_ACCOUNT_TITLE_REQUIRED),
  checkWalletType: check(keys.TYPE)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.WALLET_TYPE_REQUIRED),
  checkSourceCurrencyCode: check(keys.SOURCE_CURRENCY)
    .trim()
    .notEmpty()
    .custom(async (value, { req }) => {
      let currencies = Currencies.map((cur) => cur.code);
      if (value && currencies.includes(value)) {
      } else {
        throw new Error(messages.INVALID_SOURCE_CURRENCY);
      }
    }),
  checkDestinationCurrencyCode: check(keys.DESTINATION_CURRENCY)
    .trim()
    .notEmpty()
    .custom(async (value, { req }) => {
      let currencies = Currencies.map((cur) => cur.code);
      if (value && currencies.includes(value)) {
      } else {
        throw new Error(messages.INVALID_DESTINATION_CURRENCY);
      }
    }),
  checkAmount: check(keys.AMOUNT)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.AMOUNT_REQUIRED)
    .isFloat({ gt: 9 })
    .withMessage(messages.AMOUNT_MIN_10),
  checkWalletId: check(keys.WALLET_ID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.WALLET_ID_REQUIRED),
  recipientId: check(keys.RECIPIENT_ID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.RECIPIENT_ID_REQUIRED),
  exchangeCurrencyId: check(keys.EXCHANGE_CURRENCY_ID)
    .trim()
    .notEmpty()
    .withMessage(messages.EXCHANGE_CURRENCY_ID),
  amount: check(keys.AMOUNT)
    .trim()
    .notEmpty()
    .withMessage(messages.AMOUNT_REQUIRED),
  feeValidator: check(keys.FEE)
    .trim()
    .notEmpty()
    .withMessage(messages.FEE_REQUIRED)
    .isFloat({ gte: 0, lte: 100 })
    .withMessage(messages.FEE_RANGE),

  checkWithdraws: check(keys.WITHDRAWS)
    .isArray()
    .withMessage(messages.WITHDRAWS_REQUIRED),
  checkStatusWithdraw: check(keys.STATUS)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.STATUS_REQUIRED)
    .isIn([
      TransactionStatus.APPROVED,
      TransactionStatus.UN_APPROVED,
      TransactionStatus.CANCELLED,
    ])
    .withMessage(messages.STATUS_INVALID),
  checkWithdrawsUserId: check(keys.WITHDRAWS_USERID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.USER_ID_REQUIRED),
  checkWithdrawsBsb: check(keys.WITHDRAWS_BSB)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.BSB_REQUIRED)
    .isLength({ max: 7 })
    .withMessage(messages.BSB_INVALID),
  checkWithdrawsAccountNumber: check(keys.WITHDRAWS_ACCOUNT_NUMBER)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.ACCOUNT_NUMBER_REQUIRED)
    .isLength({ max: 20 })
    .withMessage(messages.ACCOUNT_NUMBER_INVALID_LENGTH),
  checkWithdrawsAmount: check(keys.WITHDRAWS_AMOUNT)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.AMOUNT_REQUIRED)
    .isFloat({ min: 10 })
    .withMessage(messages.AMOUNT_HUNDRED_INVALID),
  checkWithdrawsRefId: check(keys.WITHDRAWS_REFID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.REFERENCE_ID_REQUIRED)
    .isLength({ max: 18 })
    .withMessage(messages.REFERENCE_ID_INVALID_LENGTH),
  checkWithdrawsId: check(keys.WITHDRAWS_ID)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.WITHDRAWS_REQUIRED),
  checkWithdrawsStatus: check(keys.WITHDRAWS_STATUS)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.STATUS_REQUIRED),
  userStatus: check(keys.STATUS)
    .trim()
    .notEmpty()
    .withMessage(messages.STATUS_REQUIRED)
    .isIn(UserStatuses)
    .withMessage(messages.USER_STATUS_INVALID),
  transactionStatus: check(keys.STATUS)
    .trim()
    .notEmpty()
    .withMessage(messages.STATUS_REQUIRED)
    .isIn(TransactionStatuses)
    .withMessage(messages.TRANSACTION_STATUS_INVALID),
  note: check(keys.NOTE).trim().notEmpty().withMessage(messages.NOTE_REQUIRED),
  link: check(keys.LINK).trim().notEmpty().withMessage(messages.LINK_REQUIRED),
  checkDepositEmailStatus: check(keys.TYPE)
    .trim()
    .notEmpty()
    .withMessage(messages.EMAIL_TYPE_REQUIRED)
    .isIn(EmailStatuses)
    .withMessage(messages.EMAIL_TYPE_INVALID),
  checkStatusPendingDeposit: check(keys.STATUS)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(messages.STATUS_REQUIRED)
    .isIn(messages.UPDATE_DEPOSIT_INCLUDES)
    .withMessage(messages.STATUS_INVALID),
  checkTokenValidation: check(keys.TOKEN)
    .notEmpty()
    .withMessage(messages.TOKEN_REQUIRED)
    .custom(async (value, { req }) => {
      const token = await validateUserToken(value);
      if (!token) {
        throw new Error(messages.TOKEN_INVALID);
      } else {
        req.body.userId = token.id;
        req.body.eddVerificationId = token.eddVerificationId;
        return value;
      }
    }),
  checkEventUrl: check(keys.EVENT_URL)
    .notEmpty()
    .withMessage(messages.EVENT_URL_REQUIRED),
};
