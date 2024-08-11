const { urls } = require("../config");

exports.HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NOT_EXECUTE: 210,
  NOT_SUCCESSFULL: 220,
  WAIT_FOR_APPROVEL: 300,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  CONFLICT: 409,
  EXPECTATIONFAILED: 417,
};

exports.GenericConstants = {
  ERROR: "Error",
  PERCENTAGE: "percentage",
  FIXED: "fixed",
  X_API_KEY: "x-api-key",
  LOCK_TRANSFER: "lockTransfer",
  INITIATED_TRANSFER: "initiatedTransfer",
  DEPOSIT_RECEIVED: "depositReceived",
  DEPOSIT_APPROVED: "depositApproved",
  WITHDRAW_REJECTED: "withdrawRejected",
  TRANSFER: "transfer",
  TRANSFERRED: "transferred",
  SENT: "sent",
  RECEIVED: "received",
  INVITATION_TRANSACTION: "invitationTransactions",
  USER: "user",
  ADMIN: "admin",
  CHANGE_EMAIL_REQUEST: "changeEmailRequest",
  CHANGE_EMAIL: "changeEmail",
  UPDATE_PROFILE: "updateProfile",
  USER_SUSPENSION: "userSuspension",
  SUSPEND_USER: "suspendUser",
  RECOVER_USER: "recoverUser",
  SUSPEND: "suspend",
  RECOVER: "recover",
  RESENT_INVITATION: "resentInvitation",
  RESET_PASSWORD: "resetPassword",
  EDD_VERIFICATION: "eddVerification",
  WALLET_RESET: "walletReset",
  KYC_APPROVAL: "kycApproval",
  KYC_APPROVED: "kycApproved",
  KYC_STATUS_CHANGE: "kycStatusChange",
  PENDING_INVITATION: "pending invitation",
  RESEND_EMAIL: "resendEmail",
  STRICT: "strict",
  ID: "id",
  PRIMARY: "primary",
  INIT: "init",
  GREEN: "green",
  RED: "red",
  COMPLETED: "completed",
  CRYPTO_WITHDRAW_FEE: 3.5,
  DATE_TIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  DATE_FORMAT: "YYYY-MM-DD",
  _DATE_FORMAT: "MMMM DD",
  _DATE_TIME_FORMAT: "YYYY-MM-DDTHH:mm",
  OK: "Ok",
  MONTHS: "months",
  DISABLED: "disabled",
  ENHABLED: "enabled",
  TWO_FA_DISABLED: "twoFaDisabled",
  LEVEL: "level",
  PRICE: "price",
  INFO: "Info",
  ERROR: "Error",
  DONE: "DONE",
  CUSTOM_ERROR: "Custom Error",
  NAME: "name",
  MODE_PRIMARY: "primary",
  IP: "ip",
  SUM_SUB: "SumSub",
  MONOOVA: "Monoova",
  CALENDLY: "Calendly",
  MAILER: "Mailer",
  COIN_RANKING: "Coin Ranking",
  FIRE_BLOCK_API: "Fire Block Api",
  GEO_LOCATION_IP: "Geo Location Ip",
  RECAPTCHA: "Recaptcha",
  FUNCTION: "function",
  _SUPER: "super",
  _SUPER_ADMIN: "superAdmin",
  _SUPERVISOR: "supervisor",
  _ADMIN: "admin",
  _BUY: "buy",
  _SELL: "sell",
  _WITHDRAW: "withdraw",
  _DEPOSIT: "deposit",
  NEBULA_PAYMENTS_PTY_LTD: "Nebula Payments Pty Ltd",
  NEBULA_FX_PTY_LTD: "Nebula FX Pty Ltd",
  SOMETHING_WENT_WRONG_TRY_LATER:
    "Something went wrong on our end. Please try again later",
  REJECT: "Reject",
  DAY: "day",
  MONTH: "month",
  CREDIT: "credit",
  NPP: "npp",
  DED: "ded",
  IDC: "idc",
  _ID: "_id",
  WITHDRAWS: "withdraws",
  BALANCE: "balance",
  ROLE_ID: "roleId",
  AMOUNT: "amount",
  BANKS: "banks",
  HEX: "hex",
  HASH_DIGEST: "sha512",
  WAITING_TO_BOOK: "waiting to book",
  BTC: "btc",
  _BTC: "BTC",
  _ETH: "ETH",
  USD: "usd",
  _USDT: "TRX_USDT_S2UZ",
  DEPOSIT_RECEIVED: "DepositReceived",
  _ERROR: "error",
  FAIL: "fail",
  DEVELOPMENT: "development",
  HOURS: "hours",
  BASE32: "base32",
  UNKNOWN_ERROR: "Unknown Error",
  AUTHORIZATION: "authorization",
  BEARER: "Bearer",
  REFRESH_TOKEN: "refreshToken",
  DEFAULT_PORT: 4000,
  AUTHORIZATION_CODE: "authorization_code",
  WITHDRAW_BANK_CREATED: "withdrawBankCreated",
  WITHDRAW_BANK_UPDATED: "withdrawBankUpdated",
  WITHDRAW_CREATED: "withdrawCreated",
  FEE: "fee",
  WITHDRAW_UPDATED: "withdrawUpdated",
  WITHDRAW_DELETED: "withdrawDeleted",
};

exports.GenericMessages = {
  SENT_REQUESTS:
    "You sent too many requests. Please wait a while then try again",
  DATA_CHANGE_ERROR:
    "Data might have changed. Please refresh the page and try again",
  RECORD_NOT_FOUND: "Record not found",
  RECIPIENTS_NOT_FOUND: "No recipient found",
  FAILED_TO_SAVE_RECORD: "Failed to save record",
  FAILED_TO_FETCH_RECORD: "Failed to fetch record",
  RECORD_ALREADY_EXISTS: "Record already exists",
  RECORD_UPDATED_SUCCESS: "Record updated successfully",
  RECORD_FETCHED_SUCCESS: "Record fetched successfully",
  INTERNAL_SERVER_ERROR: "Internal server error",
  EMAIL_NOT_FOUND: "Email not found",
  INVALID_EMAIL: "Invalid email",
  INVALID_DATA: "Invalid data",
  ACCOUNT_SUSPENDED: "You are suspended, Please contact with Admin",
  ACCOUNT_DELETED: "Your account deleted, Please contact with Admin",
  EMAIL_SENDING_FAILED: "Email sending failed, Please try again",
  ID_IS_INVALID: "Invalid id",
  TOKEN_NOT_EXISTS: "Token doesn't exist",
  TOKEN_IS_INVALID: "Token is invalid",
  SUSPENDED_ALERT: "You are suspended, please contact support.",
  DELETION_ALERT: "You are deleted, please contact support.",
  EMAIL_TOKEN_IS_INVALID: "Email token is invalid",
  NO_PASSWORD: "Password not provided",
  INVALID_PASSWORD: "Password is invalid",
  KYC_NOT_VERIFIED: "KYC is not verified",
  INSUFICIENT_BALANCE:
    "Could not perform this action due to insufficient balance",
  INVALID_WEBHOOK_HEADERS: "Invalid webhook headers",
  TRANSACTION_RECEIVED: "Transaction received",
  UNSUPPORTED_MAIL: "Un supported mail type",
  WEBHOOK_NOT_EXECUTABLE: "Webhook is not executable",
  PASSWORD_UPDATED_SUCCESS: "Password updated successfully",
  EMAIL_CHANGED_SUCCESS: "Email changed successfully",
  EMAIL_CHANGED_FAILED: "Failed to updated email",
  EMAIL_CHANGED_INVALID_TOKEN: "Email change request token is invalid",
  CHANGE_EMAIL_REQUEST_SENT:
    "Please check your email and follow the steps for verification",
  SAME_EMAIL_CONFLICT:
    "Please enter a different email instead of current email",
  ACCOUNT_ALREADY_EXISTS:
    "An account with this email address is already registered",
  RESET_PASSWORD_FAILURE: "Couldn't reset password",
  CURRENT_PASSWORD_INVALID: "Current password is invalid",
  SAME_NEW_PASSWORD: "New password should be different from old password",
  TWO_FA_ENABLED: "2FA enabled successfully",
  COULD_NOT_UPDATE_INFO: "Could not update info",
  INVALID_PASSWORD: "Invalid Password",
  FAILED_PASSWORD_VERIFY: "Unable to verify password",
  FEE_UPDATED_SUCCESS: "Fee updated successfully",
  SUCCESS_FETCHED_DATA: "Data fetched successfully",
  NOT_AUTHORIZED: "You are not authorized to access this call.",
  WITHDRAW_INITIATED: "Withdraw request initiated",
  ACCESS_DENIED: "Access denied",
};

exports.RoleMessages = {
  CREATED: "Roles created",
  NOT_FOUND: "Role not found",
  UNAUTHORIZED: "You are not authorized to perform this action",
};

exports.WalletMessages = {
  SAVE_FAILED: "Failed to save wallet",
  FIND_FAILED: "Failed to find wallet",
  NOT_FOUND: "Wallet not found",
  ALREADY_EXISTS: "Wallet already exists",
  WALLETS_FETCHED_SUCCESS: "Wallets fetched successfully",
  WALLET_CREATED_SUCCESS: "Wallet created successfully",
  WITHDRAW_NOT_FOUND: "Withdraw wallet not found",
  WITHDRAW_ALREADY_EXISTS: "Withdraw wallet already exists",
  WITHDRAW_WALLET_CREATED: "Withdraw wallet created",
  CREATE_BANK_FAILED: "Failed to create bank account",
  BANK_ACCOUNT_STATUS_FAILURE: "Bank account status couldn't fetched",
  BANK_ACCOUNT_STATUS_COULD_NOT_UPDATED: "Bank account status couldn t updated",
  BALANCE_FETCHED_SUCCESS: "Balance fetched successfully",
  BALANCE_FETCHED_FAILED: "Failed to fetch balance",
  FEE_FETCHED_SUCCESS: "Fee fetched successfully",
  FEE_FETCHED_FAILED: "Failed to fetch fee",
  CREATE_WITHDRAW_BANK: (wallet) => {
    return `You have created withdraw wallet(${wallet?.data?.accountNumber}).`;
  },
  UPDATE_WITHDRAW_BANK: (wallet) => {
    return `You have update withdraw wallet(${wallet?.data?.accountNumber}).`;
  },
  GENERATE_DEPOSIT_ACCOUNT: (wallet) => {
    return (
      "You" +
      " have generated deposit bank(" +
      wallet?.data?.accountNumber +
      ")"
    );
  },
  RECEIVER_SUSPENDED: "Reciever is suspended",
  RECEIVER_DELETED: "Reciever is deleted",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  FAILED_CREATE_TRANSACTION: "Failed to create transaction",
};

exports.BalanceMessages = {
  SAVE_FAILED: "Failed to save balance",
  FIND_FAILED: "Failed to find balance",
  NOT_FOUND: "Balance not found",
  INSUFFICIENT_BALANCE: "Insufficient balance",
};

exports.FunctionNames = {
  findById: "findById",
  findByAggregation: "findByAggregation",
  verifyGoogleRecaptcha: "verifyGoogleRecaptcha",
  create: "create",
  updateUser: "updateUser",
  update: "update",
  save: "save",
  countUsers: "countUsers",
  addActivityLog: "addActivityLog",
  getGeolocationOfIp: "getGeolocationOfIp",
  getUserSumSubToken: "getUserSumSubToken",
  resetUserData: "resetUserData",
  createBankAccount: "createBankAccount",
  getBankAccountStatus: "getBankAccountStatus",
  getCurrencyList: "getCurrencyList",
  getCurrencyRates: "getCurrencyRates",
  fetchUserData: "fetchUserData",
  withdrawBalance: "withdrawBalance",
  depositBalance: "depositBalance",
  unclearTransactionByDate: "unclearTransactionByDate",
  createDirectCredit: "createDirectCredit",
  updateMany: "updateMany",
  getCalendlyEventSlot: "getCalendlyEventSlot",
  getCalendlyToken: "getCalendlyToken",
};

exports.UserMessages = {
  COULD_NOT_UPDATE_USER_INFO: "Could not update User info",
  CONTACT_EMAIL_UPDATED: "Contact email updated successfully",
  CONTACT_EMAIL_ADDED: "Contact email added successfully",
  KYC_VERIFIED: "Please do kyc before transaction",
  USER_NOT_FOUND: "User not found",
  INVALID_KYC_LEVEL: "Invalid KYC level",
  USER_LOGOUT: "User logout successfully",
  ACCOUNT_NOT_FOUND: "Account not found",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
  INVALID_PASSWORD: "Invalid Password",
  CURRENT_PASSWORD_INVALID: "Current password is invalid",
  SAME_NEW_PASSWORD: "New password should be different from old password",
  INVALID_RECAPTCHA: "Invalid recaptcha",
  SUCCESSFULLY_VERIFY_RECAPTCHA: "Successfully verify recaptcha",
  EMAIL_ALREADY_EXIST:
    "An account with this email address is already registered",
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated",
  ACCOUNT_CREATED_SUCCESS: "Account created successfully",
  CONFIRMATION_TOKEN_INVALID: "Confirmation token is invalid",
  RESET_PASSWORD_FAILURE: "Couldn't reset password",
  ADMIN_PASSWORD_UPDATED: "Admin Password updated",
  USER_PASSWORD_UPDATED: "User Password updated",
  ACCOUNT_VERIFICATION_FAILURE: "Couldn't verified their account",
  ADMIN_VERIFIED_ACCOUNT: "Admin verified their aacount",
  USER_VERIFIED_ACCOUNT: "User verified their aacount",
  REGISTER_ACCOUNT_SUCCESS: "Your account was successfully created",
  CONFIRMATION_SUCCESS_WITH_PASSWORD:
    "Account verified, and password set successfully",
  FORGET_PASSWORD_SUCCESS:
    "Reset password instructions have been sent to the registered email address",
  PASSWORD_RESET_SUCCESS: "Your password has been reset successfully",
  USER_LOGIN_SUCCESS: "User logged in successfully",
  USER_PROFILE_UPDATED_SUCCESS: "Update profile information.",
  USER_PROFILE_UPDATED_FAILURE: "User information doesn't updated",
  USER_INFORMATION_UPDATED: "Information updated successfully",
  FAILED_TO_FIND_USER: "Failed to find user",
  FAILED_TO_SAVE_USER: "Failed to save user",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  COULD_NOT_GET_USER_IP_LOCATION: "Couldn't get the user IP geolocation.",
  SUCCESSFULLY_GET_USER_IP_LOCATION:
    "Successfully get the user IP geolocation.",
  CHANE_IN_IP_DEDECTED: "Notice: Change in IP Address Detected.",
  EMAIL_NOT_SENT: "Invitation mail cannot be sent",
  EMAIL_NOT_VERIFIED: "Please verify your email address",
  EMAIL_VERIFIED: "Your email has been successfully registered",
  TOKEN_INVALID: "Token is invalid",
  TOKEN_EXPIRED: "Token Expired",
  TOKEN_VERIFIED: "Token verified",
  TWO_FA_ENABLED: "2FA enabled successfully",
  USER_ALREADY_EXISTS:
    "An account with this email address is already registered",
  USER_SAME_EMAIL: "Please enter a different email instead of current email",
  USER_CHANGE_EMAIL_REQUEST_SENT:
    "Please check your email and follow the steps for verification",
  USER_CHANGE_EMAIL_REQUEST_FAILED: "Unable to send verification email",
  USER_CHANGE_EMAIL_REQUEST: "Email change request sent",
  USER_CHANGE_PASSWORD_REQUEST_FAILED: "Unable to send reset password email",
  USER_CHANGE_EMAIL_INVALID_TOKEN: "Email change request token is invalid",
  USER_CHANGE_EMAIL_FAILED: "Unable to change email",
  USER_CHANGE_EMAIL_SUCCESS: "User Email changed",
  USER_CHANGE_EMAIL: "User email changed successfully",
  USER_EMAIL_VERIFICATION_SEND: "Verification mail has been sent to user",
  TWO_FA_RESET: "2FA reset successfully",
  TWO_FA_ENABLED: "2FA enabled successfully",
  SUSPENDED: "User suspended",
  UNSUSPENDED: "User unsuspended",
  DELETED: "User Deleted",
  KYC_UPDATED: "User KYC updated",
  USER_BANK_RESET_INFO_SUCCESS: "User bank reset successfully",
  SUSPENDED_USER_ACCOUNT: "User account suspended",
  UNSUSPENDED_USER_ACCOUNT: "User account unsuspended",
  DELETED_USER_ACCOUNT: "User account deleted",
  DELETED_USER_ACCOUNT: "User account deleted",
  USER_EDD_VERIFIED: "User EDD Verified",
  USER_ALREADY_VERIFIED: "User has already been verified.",
  WITHDRAW_ACCOUNT_CREATED:
    "Bank Account details have been added to your profile successfully",
  SUMSUB_TOKEN_SUCCESS: "Successfully got user sum sub token",
  SUMSUB_FETCH_USER_DATA_SUCCESS: "Successfully got sum sub user data",
  SUMSUB_RESET_USER_DATA_SUCCESS: "Successfully got sum sub reset user data",
  FAILED_PASSWORD_VERIFY: "Unable to verify password",
  INVITED_USER: (email) => {
    return `You have invited ${email} as recipient.`;
  },
  USER_ACCOUNT_NOT_FOUND: (accountNumber) => {
    return `User with account number ${accountNumber} not found!`;
  },
  SENDER_NOT_FOUND: "Sender not found",
  USERS_FETCHED_SUCCESS: "Users fetched successfully",
  ALREADY_SUSPENDED: "User already suspended",
  ALREADY_VERIFIED: "User already verified",
  NOT_VERIFIED: "User is not verified",
  RECOVER_FAILED: "Failed to recover user",
  SUSPENDED: "User is suspended",
  RECOVERED: "User is recovered",
  PREFERENCE_NOT_FOUND: "Preference not found",
  RESEND_EMAIL_SENT: "Verification email sent successfully",
  EMAIL_RESEND_LIMIT: (remainingTime) => {
    return `Email resend limit exceeded. Try again after ${remainingTime} seconds`;
  },
};

exports.ActivityMessages = {
  FAIL_TO_SAVE_ACTIVITY: "Failed to save activity",
  FAIL_TO_FETCH_ACTIVITIES: "Unable to fetch activities",
  ACTIVITIES_FETCHED_SUCCESS: "Activities fetched successfully",
  SUSPENDED_BY_ADMIN: (suspend = false) =>
    suspend ? "You are suspended by admin" : "You are unsuspended by admin",
  ADMIN_SUSPENDED_USER: (email, suspended = false) => {
    if (suspended) {
      return `You suspended user with email (${email})`;
    } else {
      return `You unsuspended user with email (${email})`;
    }
  },
  WITHDRAW_REQUEST_SUBMITTED: (transaction, wallet) => {
    return (
      "Withdrawal(" +
      transaction?.id +
      ")" +
      " request against " +
      wallet?.data?.accountNumber +
      " of amount $" +
      transaction?.amount +
      " has been submitted."
    );
  },
  WITHDRAW_REQUEST_INITIATED: (transaction = {}, wallet = {}) => {
    return (
      "Withdrawal(" +
      transaction?.id +
      ")" +
      " request against " +
      wallet?.data?.accountNumber +
      " of amount $" +
      transaction?.amount +
      " has been initiated."
    );
  },
  WITHDRAWAL_REQUEST_DELETED: (transaction = {}, wallet = {}) => {
    return (
      "Withdrawal(" +
      transaction.id +
      ")" +
      " request against " +
      wallet?.data?.accountNumber +
      " of amount $" +
      transaction.amount +
      " has deleted by Admin."
    );
  },
  INITIATED_TRANSFER: (amount, email) => {
    return `You have initiated transfer of $${amount} to recipient ${email}.`;
  },
  DEPOSIT_APPROVED: (amount) => {
    return `You have received fiat deposit $${amount}, and updated the fiat balance`;
  },

  WITHDRAW_REJECTED: (amount) => {
    return `Your fiat withdraw transaction of $${amount}, cancelled by monoova`;
  },

  ADMIN_APPROVED_TRANSACTION: (amount, email) => {
    return `Admin has approved transaction of $${amount} to ${email}`;
  },

  RECEIVED_TRANSACTION: (amount, email) => {
    return `You have received $${amount} from ${email}`;
  },
  RECEIVED_BACK_TRANSACTION: (status, amount, email) => {
    return status === "rejected"
      ? `Transaction of $${amount} to recipient ${email} rejected by admin`
      : `You have received transaction $${amount} back that was sent to ${email} due to some issue`;
  },
  ADMIN_APPRROVAL_TRANSACTION: (transaction, status, approved = true) => {
    return status === "rejected"
      ? `You have rejected transaction (${transaction.id}) of amount $${transaction.amount}.`
      : status === "approved"
      ? approved
        ? `You have approved transaction (${transaction.id}) of amount $${transaction.amount}.`
        : `Your approved transaction is rejected due to some issue.`
      : "";
  },
  INITITAED_INVITATION_TRANSACTION: () => {
    return `We have executed your transactions that were in pending due to kyc`;
  },

  WITHDRAWAL_REQUEST_SUBMITTED: (transaction = {}, wallet = {}) => {
    return (
      "Withdrawal(" +
      transaction.id +
      ")" +
      " request against " +
      wallet?.data?.accountNumber +
      " of amount $" +
      transaction.amount +
      " has submitted by Admin."
    );
  },
  WITHDRAWAL_UPDATED: (transaction = {}, wallet = {}, isCredit = false) => {
    return `Withdrawal(${transaction.id}) request against ${
      wallet?.data?.accountNumber
    } of amount $${transaction.amount} ${
      isCredit ? transaction.status : "updated"
    } by Admin`;
  },
  WITHDRAWAL_BATCH_CREATED: (batchId) => {
    return "Withdrawal batch(" + batchId + ")" + " has created by Admin.";
  },
  WITHDRAWAL_BATCH_UPDATED: (batchId) => {
    return "Withdrawal batch(" + batchId + ")" + " has updated by Admin.";
  },
  ADMIN_RESENT_INVITATION: (email) => {
    return `You sent invitation email to user ${
      email ? `with mail ${email}` : ""
    }`;
  },
  ADMIN_RESET_PASSWORD: (email) => {
    return `You sent password reset email to user ${
      email ? `with mail ${email}` : ""
    }`;
  },
  ADMIN_EDD_VERIFICATION: (verified = false, email) =>
    `You have ${verified ? "verified" : "reset"} edd verification for user${
      email ? ` with mail ${email}` : ""
    }`,
  ADMIN_RESET_WITHDRAWAL_WALLET: (email) =>
    `You have reset withdrawal wallet for user${
      email ? ` with mail ${email}` : ""
    }`,
  ADMIN_APPROVED_KYC: (email) =>
    `You have approved kyc of user${email ? ` with mail ${email}` : ""}`,
  ADMIN_LEVEL_CHANGE_KYC: (email, level) =>
    `You have changed kyc of user${
      email ? ` with mail ${email} to ${level}.` : ""
    }`,
  ADMIN_GENERATE_DEPOSIT_ACCOUNT: (wallet, email) => {
    return (
      "You have generated deposit bank(" +
      wallet?.data?.accountNumber +
      ")" +
      `${email ? ` for user with mail ${email}` : ""}`
    );
  },
  ADMIN_UPDATED_NOTE: (edd) =>
    `You have updated note of edd verification Id ${edd.id} to ${edd.note}`,
  ADMIN_UPDATED_LINK: (edd) =>
    `You have updated link of edd verification Id ${edd.id} to ${edd.videoLink}`,
  PROFILE_UPDATED: (email) =>
    `You have updated profile of user${email ? ` with mail ${email}` : ""}`,
  ADMIN_SEND_DEPOSIT_MAIL: (email, type) =>
    `You have sent ${type} to user${email ? ` with mail ${email}` : ""}`,
};

exports.RecipientMessages = {
  NOT_FOUND: "Recipient not found",
  FETCHED_SUCCESS: "Recipient fetched successfully",
  ADDED_SUCCESS: "Recipient added successfully",
  DELETED_SUCCESS: "Recipient deleted successfully",
  ALREADY_EXISTS: "Recipient already exists",
  SUSPENDED: "Recipient is suspended, couldn't make transfer",
  EMAIL_RECIPIENT_NOT_ADD: "This email cannot be added as recipient",
  CANNOT_ADD_YOURSELF: "You cannot add yourself as recipient",
  ADDED_RECIPIENT: (email) => {
    return `You have added ${email} as recipient.`;
  },
  REMOVED_RECIPIENT: (email) => {
    return `You have removed ${email} as recipient.`;
  },
};

exports.RepositoriesConstants = {
  USER_FILEDS: "-password -salt -createdAt -updatedAt",
  BATCH_FIELDS_BY_WITHDRAW: "_id status",
  BATCH_FILEDS: "_id status createdAt actionType createdBy",
  TRANSFER: "transfer",
  FETCHING_DEPOSIT_FIELDS: "firstName lastName reference",
  DEPOSIT_BY_USER_INFO_FIELDS:
    "id firstName lastName email contactEmail userType role uniqueId",
  PENDING_DEPOSIT_FIELDS: "firstName lastName reference email",
  FETCHING_BANKING_DETAIL_FIELDS:
    "bankAccountNumber bsb bankAccountTitle type active createdAt updatedAt",
  FETCHING_USER_DETAIL_FILEDS:
    "firstName lastName email contactNumber picture addressLine1 addressLine2 city state postCode countryCode dob bsb bankAccountNumber bankAccountTitle reference level walletAddress twoFa",
  WITHDRAW_BY_USER_FILEDS:
    "_id firstName lastName email bankAccountTitle contactNumber suspended deleted level",
  WEBHOOK_FIELDS: "_id type data createdAt updatedAt",
};

exports.FiatManagment = {
  FAILED_TO_FIND_RECORD: "Failed to find record",
  FAILED_TO_SAVE_BATCH: "Failed to save batch",
  FAILED_TO_FETCH_BATCH_WITHDRAWAL: "Unable to fetch batch withdrawal",
  FAIL_TO_DELETE_BATCH_WITHDRAWAL: "Unable to delete batch withdrawal",
  FAIL_TO_SAVE_WITHDRAWAL: "Unable to save user withdrawal",
  BALANCE_DEBITED_WITHDRAWAL: "Balance debited for withdrawal",
  WITHDRAW_CREATED: "Withdrawal created successfully",
  SUCCESSFULLY_FETCHED_DEPOSITS: "Successfully fetched deposits",
  SUCCESSFULLY_FETCHED_BATCH_WITHDRAWAL:
    "Successfully fetched batch withdrawals",
  SUCCESSFULLY_FETCHED_WITHDRAWAL: "Successfully fetched withdrawals",
  WITHDRAWAL_CREATED_SUCCESSFULLY: "Withdrawal created successfully",
  WITHDRAWAL_UPDATED_SUCCESSFULLY: "Withdrawal updated successfully",
  SUCCESSFULLY_UPDATED_WITHDRAWAL_STATUS:
    "Withdrawal status updated successfully",
  STATUS_ALREADY_APPROVED: "Status already approved",
  USER_IS_SUSPENDED: "User is suspended",
  KYC_NOT_VERIFIED: "KYC is not verified",
  DEPOSIT_TRANSACTION_ALREADY: "Deposit transaction already ",
  DEPOSIT_STATUS_UPDATED: "Deposit status updated successfully",
};

exports.EddMessages = {
  NOT_FOUND: "Edd verification not found",
  UNABLE_TO_FIND: "Unable to find edd verification",
  FAILED_SAVE: "Failed to save edd verification",
  FETCHED_SUCCESS: "Edd verifications fetched successfully",
  NOTES_UPDATED_SUCCESS: "Note updated",
  NOTES_UPDATED_FAILED: "Failed to update note",
  LINK_UPDATED_SUCCESS: "Link updated",
  EMAIL_SENT: "Email sent",

  EVENT_SLOT_ALREADY_EXISTS: "Event slot already exist with active status",
  EVENT_SLOT_EMAIL_EXPIRED: "The email of the booking slot has been expired",
  NO_ACTIVE_SLOT_EXISTS: "No active event slot exist",
  EVENT_SLOT_CREATED: "Event slot created successfully",
  EVENT_SLOT_NOT_CREATED: "Could not create Event slot",
  EVENT_SLOT_NOT_GET: "Could not get Calendly event slot",
  EVENT_SLOT_GET_SUCCESSFULLY: "Successfully get Calendly event slot",
  UNABLE_TO_SAVE_EVENT_SLOT: "Unable to save event slot",
  UNABLE_TO_FIND_EVENT_SLOT: "Unable to find event slot",
  UNABLE_TO_UPDATE_EVENT_SLOT: "Unable to update event slot by id",
};

exports.GENERIC_CONSTANTS = {
  ID: "id",
  PRIMARY: "primary",
  INIT: "init",
  GREEN: "green",
  RED: "red",
  COMPLETED: "completed",
  CRYPTO_WITHDRAW_FEE: 3.5,
  DATE_TIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  DATE_FORMAT: "YYYY-MM-DD",
  _DATE_FORMAT: "MMMM DD",
  _DATE_TIME_FORMAT: "YYYY-MM-DDTHH:mm",
  OK: "Ok",
  MONTHS: "months",
  DISABLED: "disabled",
  ENHABLED: "enabled",
  TWO_FA_DISABLED: "twoFaDisabled",
  LEVEL: "level",
  PRICE: "price",
  INFO: "Info",
  ERROR: "Error",
  DONE: "DONE",
  CUSTOM_ERROR: "Custom Error",
  NAME: "name",
  MODE_PRIMARY: "primary",
  IP: "ip",
  SUM_SUB: "SumSub",
  MONOOVA: "Monoova",
  CALENDLY: "Calendly",
  MAILER: "Mailer",
  COIN_RANKING: "Coin Ranking",
  FIRE_BLOCK_API: "Fire Block Api",
  GEO_LOCATION_IP: "Geo Location Ip",
  RECAPTCHA: "Recaptcha",
  FUNCTION: "function",
  _SUPER: "super",
  _SUPER_ADMIN: "superAdmin",
  _SUPERVISOR: "supervisor",
  _ADMIN: "admin",
  _BUY: "buy",
  _SELL: "sell",
  _WITHDRAW: "withdraw",
  _DEPOSIT: "deposit",
  NEBULA_PAYMENTS_PTY_LTD: "Nebula Payments Pty Ltd",
  NEBULA_FX_PTY_LTD: "Nebula FX Pty Ltd",
  SOMETHING_WENT_WRONG_TRY_LATER:
    "Something went wrong on our end. Please try again later",
  REJECT: "Reject",
  DAY: "day",
  MONTH: "month",
  CREDIT: "credit",
  NPP: "npp",
  DED: "ded",
  IDC: "idc",
  _ID: "_id",
  WITHDRAWS: "withdraws",
  BALANCE: "balance",
  ROLE_ID: "roleId",
  AMOUNT: "amount",
  BANKS: "banks",
  HEX: "hex",
  HASH_DIGEST: "sha512",
  WAITING_TO_BOOK: "waiting to book",
  BTC: "btc",
  _BTC: "BTC",
  _ETH: "ETH",
  USD: "usd",
  _USDT: "TRX_USDT_S2UZ",
  DEPOSIT_RECEIVED: "DepositReceived",
  _ERROR: "error",
  FAIL: "fail",
  DEVELOPMENT: "development",
  HOURS: "hours",
  BASE32: "base32",
  UNKNOWN_ERROR: "Unknown Error",
  AUTHORIZATION: "authorization",
  BEARER: "Bearer",
  REFRESH_TOKEN: "refreshToken",
  DEFAULT_PORT: 4000,
  AUTHORIZATION_CODE: "authorization_code",
  WITHDRAW_BANK_CREATED: "withdrawBankCreated",
  WITHDRAW_BANK_UPDATED: "withdrawBankUpdated",
  WITHDRAW_CREATED: "withdrawCreated",
  FEE: "fee",
  WITHDRAW_UPDATED: "withdrawUpdated",
  WITHDRAW_DELETED: "withdrawDeleted",
};

exports.AdminMessages = {
  DIRECT_CREDIT_ERROR: "Direct Credit request couldn't submitted on moonova",
};

exports.UserConstants = {
  USER: "user",
  BANK: "bank",
  RECIPIENT: "recipient",
  USER_CREATED: "userCreated",
  USER_UPDATED: "userUpdated",
  USER_DELETED: "userDeleted",
  USER_INVITED: "userInvited",
  USER_KYC: "userKyc",
  KYC: "kyc",
  PROFILE: "profile",
  ADMIN: "admin",
  VERIFIED_ACCOUNT: "verifiedAccount",
  FORGET_PASSWORD: "forgetPassword",
  RESET_PASSWORD: "resetPassword",
  UPDATE_PROFILE: "updateProfile",
  ACCEPTED_TERM: "AcceptTerms",
  CHANGE_PASSWORD: "changePassword",
  CHANGE_EMAIL_REQUEST: "changeEmailRequest",
  CHANGE_EMAIL: "changeEmail",
  USER_BANK_CREATED: "userBankCreated",
  ADMIN_RESET_MAIL: "adminResentEmail",
  RECIPIENT_ADDED: "recipientAdded",
  RECIPIENT_DELETED: "recipientDeleted",
  EDD_VERIFICATION: "eddVerification",
  UPDATED_EDD_NOTE: "updateEddNote",
  UPDATED_EDD_LINK: "updateEddLink",
};

exports.TransactionMessages = {
  NOT_FOUND: "Transaction not found",
  NOT_FOUND_ID: "Transaction Id not found",
  COULD_NOT_SAVE_REQUEST: "Couldn't saved your request",
  TRADE_TRANSACTIONS_FETCHED: "Transactions fetched successfully",
  UNABLE_TO_FETCH_TRANSACTION: "Unable to fetch transaction",
  UNABLE_TO_CREATE_TRANSACTION: "Unable to create transaction",
  RECEIVER_NOT_FOUND: "Receiver not found",
  FAILED_INVITATITON: "Failed to update invitation transaction",
  FEE_FETCHED_SUCCESS: "Fee fetched successfully",
  UNABLE_TO_DELETE_TRANSACTION: "Unable to delete transaction",
  REJECTED_BY_ADMIN: "Transaction rejected by admin",
  ALREADY_PROCESSING: "Transaction already in processing",
  PROCESSING: "Transaction is in processing",
  APPROVED_FAILED: "Failed to approve transaction",
};

exports.TransactionStatus = {
  IN_PROGRESS: "inProgress",
  PENDING: "pending",
  PENDING_INVITATION: "pendingInvitation",
  APPROVED: "approved",
  REJECTED: "rejected",
  UN_APPROVED: "unApproved",
  CANCELLED: "cancelled",
  CONFIRMED: "confirmed",
  _PENDING_INVITATION: "pendinginvitation",
  BOOKED: "booked",
};

exports.MailMessages = {
  UNABLE_TO_SEND_EMAIL: "Unable to send email.",
  READY_TO_SEND_EMAIL: "Server is ready to send email,..",
  UNABLE_TO_SEND_IP_CHANGED_EMAIL: "Unable to send Ip changed Email to User",
  SENT_PASSWORD_RESET_MAIL: "Password reset mail has sent to user's mail",
};

exports.QrCodeMessages = {
  QR_GENERATED_SUCCESS: "QR code generated successfully",
  QR_GENERATION_FAILURE: "Unable to generate QR code",
};

exports.TwoFaVerificationMessages = {
  INVALID_2FA_VERIFICATION_CODE: "2FA verification code is invalid",
  VALID_2FA_VERIFICATION_CODE: "2FA verified Successfully",
};

exports.CurrencyMessages = {
  FETCHED_SUCCESS: "Currencies fetched successfully",
  NOT_FOUND: "Currencies not found",
  SUCCESS_FETCH_EXCHANGE_RATE: "Exchange rate fetched successfully",
  FAILED_FETCH_EXCHANGE_RATE: "Failed to fetch exchange rate",
};

exports.WithdrawalMessages = {
  WITHDRAWAL_SAVED: "withdrawal saved successfully",
  WITHDRAWAL_CREATED: "withdrawal created successfully.",
  WITHDRAWAL_UPDATED: "withdrawal updated successfully.",
  WITHDRAWAL_DELETED: "withdrawal deleted successfully.",
  WITHDRAWAL_SUBMITTED: "Withdrawal submitted successfully.",
  WITHDRAWAL_MOONOVA_ERROR: "Withdrawal couldn't submitted on moonova.",
  WITHDRAWAL_STATUS_UPDATED: "Withdrawal status updated successfully",
};

exports.Roles = {
  USER: "user",
  SUPER_ADMIN: "superAdmin",
};

exports.ApiMethods = {
  POST: "post",
  GET: "get",
};

exports.WalletTypeList = ["deposit", "withdraw"];

exports.WalletTypes = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
};

exports.CurrencyCodes = {
  AUD: "AUD",
  EUR: "EUR",
  GBP: "GBP",
  USD: "USD",
};

exports.Currencies = [
  {
    name: "Australian Dollar",
    symbol: "AU$",
    code: "AUD",
    logo: `${urls.serverUrl}/api/images/au.svg`,
  },
  {
    name: "Euro",
    symbol: "€",
    code: "EUR",
    logo: `${urls.serverUrl}/api/images/eur.svg`,
  },
  {
    name: "British Pound Sterling",
    symbol: "£",
    code: "GBP",
    logo: `${urls.serverUrl}/api/images/gbp.svg`,
  },
  {
    name: "US Dollar",
    symbol: "$",
    code: "USD",
    logo: `${urls.serverUrl}/api/images/us.svg`,
  },
];

exports.CurrencyTypes = {
  FIAT: "fiat",
  CRYPTO: "crypto",
};

exports.FeeTypesList = ["percentage", "fixed"];

exports.FeeType = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};

exports.UserStatuses = ["", "verified", "suspended", "deleted"];

exports.OffsetLimit = 10;

exports.ResendEmailLimit = 30000;

exports.UserStatus = {
  VERIFIED: "verified",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};

exports.UserLogMessages = {
  FAILED_TO_FIND_USER_LOG: "Failed to find user log",
  FAILED_TO_SAVE_USER_LOG: "Failed to save user log",
  FAILED_TO_FETCH_USER_LOG: "Failed to fetch user log",
  USER_LOGS_FETCHED: "User logs fetched successfully",
};

exports.QueueList = ["mail", "transaction", "currency"];

exports.QueueType = {
  MAIL: "mail",
  TRANSACTION: "transaction",
  CURRENCY: "currency",
};

exports.QueueSubType = {
  DEPOSIT: "deposit",
  DISHONOURS: "dishonours",
  INVITE_RECIPIENT: "inviteRecipient",
  CHANGE_IP_ADDRESS: "changeIpAddress",
  FORGOT_PASSWORD: "forgotPassword",
  PASSWORD_RESET: "passwordReset",
  PASSWORD_RESET_SUCCESS: "passwordResetSuccess",
  CREATE_ACCOUNT: "createAccount",
  CHANGE_EMAIL: "changeEmail",
  KYC_ALERT_EMAIL: "kycAlertEmail",
  INITIAL_EMAIL: "initialEmail",
  FOLLOW_UP_EMAIL: "followUpEmail",
  FINAL_EMAIL: "finalEmail",
  DEPOSIT_RECEIVED: "depositReceived",
  CHANGE_EMAIL_NOTIFICATION: "changeEmailNotification",
  KYC_APPROVED_MAIL: "kycApprovedMail",
  KYC_REJECTED_MAIL: "kycRejectedMail",
  LOCK_TRANSFER: "lockTransfer",
  WITHDRAW: "withdraw",
  TRANSFER: "transfer",
  INVITATION_PENDING: "invitationPending",
  WITHDRAW_APPROVED_MAIL: "withdrawApprovedMail",
  CURRENCY_QUEUE: "currencyQueue",
  DEPOSIT_APPROVED: "depositApproved",
  DEPOSIT_REJECTED_MAIL: "depositRejectedMail",
  DEPOSIT_APPROVED_MAIL: "depositApprovedMail",
  CALENDLY_BOOKED_MAIL: "calendlyBookedMail",
};

exports.QueueOptions = {
  attempts: 3,
  redisOptions: {
    enableReadyCheck: false,
  },
};

exports.SingleAttempQueue = {
  attempts: 1,
  redisOptions: {
    enableReadyCheck: false,
  },
};

exports.X_API_KEY = "x-api-key";

exports.TransactionTypes = ["deposit", "withdraw", "transfer"];

exports.TransactionType = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  TRANSFER: "transfer",
};

exports.TransactionStatuses = [
  "pendingInvitation",
  "pending",
  "approved",
  "rejected",
];

exports.EddStatus = {
  PENDING: "pending",
  BOOKED: "booked",
  COMPLETED: "completed",
};

exports.EmailStatusValue = {
  "initial-email": 1,
  "follow-up-email": 2,
  "final-email": 3,
};

exports.EmailStatus = {
  INITIAL_EMAIL: "initial-email",
  FOLLOW_UP_EMAIL: "follow-up-email",
  FINAL_EMAIL: "final-email",
};

exports.EmailStatuses = ["initial-email", "follow-up-email", "final-email"];
exports.ValidKycLevels = [0, 1, 2, 3];
exports.Permissions = {
  VIEW_ACTIVITY: "view_activity",
  VIEW_PROFILE_SETTING: "view_profile_setting",
  UPDATE_PROFILE_SETTING: "update_profile_setting",
  CHANGE_PASSWORD_PROFILE_SETTING: "change_password_profile_setting",
  RESET_TWO_FA_PROFILE_SETTING: "reset_two_fa_profile_setting",
  UPDATE_TRANSACTION_FEE: "update_transaction_fee",
  VIEW_CURRENCY: "view_currency",
  VIEW_EXCHANGE_RATE: "view_exchange_rate",
  VIEW_TRANSACTION: "view_transaction",
  APPROVE_TRANSACTION: "approve_transaction",
  REJECT_TRANSACTION: "reject_transaction",
  VIEW_USER: "view_user",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  SUSPEND_USER: "suspend_user",
  UNSUSPEND_USER: "unsuspend_user",
  RESEND_SET_PASSWORD_EMAIL_USER: "resend_set_password_email_user",
  RESEND_RESET_PASSWORD_EMAIL_USER: "resend_reset_password_email_user",
  EDD_VERIFIED_USER: "edd_verified_user",
  RESET_WITHDRAW_BANK_USER: "reset_withdraw_bank_user",
  UPDATE_KYC_STATUS_USER: "update_kyc_status_user",
  APPROVE_PENDING_DEPOSIT: "approve_pending_deposit",
  REJECT_PENDING_DEPOSIT: "reject_pending_deposit",
};

exports.MongoConstants = {
  PRIMARY: "primary",
  LOCAL: "local",
  MAJORITY: "majority",
};

exports.KycStatusLabel = ["rejected", "not verified", "pending", "verified"];
