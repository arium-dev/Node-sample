const allowedUrls = process.env.ALLOWED_ORIGIN.split(",");
const port = process.env.PORT || 4000;
const queuePort = process.env.QUEUE_PORT || 4010;
const OffsetLimit = 10;

const jwtOptions = {
  issuer: process.env.JWT_ISSUER_NAME,
  algorithm: process.env.JWT_ALGORITHM,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIREIN,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
};

const urls = {
  appUrl: process.env.APP_URL,
  adminAppUrl: process.env.ADMIN_APP_URL,
  sumSubApiUrl: process.env.SUMSUB_API_URL,
  monovaUrl: process.env.MONOOVA_URL,
  currencyUrl: process.env.CURRENCY_API_URL,
  serverUrl: process.env.SERVER_URL,
  ipGeolocationUrl: process.env.IP_GEOLOCATION_URL,
  ipStackUrl: process.env.IP_STACK_URL,
};

const testCredentials = {
  email: process.env.TEST_CASE_EMAIL,
  password: process.env.TEST_CASE_PASSWORD,
};

const contactSupport = {
  email: process.env.SUPPORT_EMAIL,
  kycEmail: process.env.KYC_SUPPORT_EMAIL,
};

const emailCredentails = {
  email: process.env.EMAIL,
  password: process.env.EMAIL_PASSWORD,
};

const raquel = {
  email: process.env.RAQUEL_EMAIL,
};

const recaptcha = {
  recaptchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
};

const token = {
  monoova: process.env.MONOOVA_DEPOSIT_TOKEN,
  monoovaWithdraw: process.env.MONOOVA_WITHDRAW_TOKEN,
  ipStackKey: process.env.IP_STACK_KEY,
};

const theresholdLimit = process.env.THRESHOLD_LIMIT;
const twoFaVerificationCode = process.env.TWOFA_VERIFICATION_CODE;
const webhookApiKey = process.env.WEBHOOK_API_KEY;

const sumSubKeys = {
  sumSubAppToken: process.env.SUMSUB_APP_TOKEN,
  sumSubSecretKeys: process.env.SUMSUB_SECRET_KEY,
  sumSubLevelName: process.env.SUMSUB_LEVEL_NAME,
};

const currencyKeys = {
  apiKey: process.env.CURRENCY_API_KEY,
};

const redis = {
  url: process.env.REDIS_URI,
};

const adminCredentials = {
  FIRST_NAME: process.env.SUPER_ADMIN_FIRST_NAME,
  LAST_NAME: process.env.SUPER_ADMIN_LAST_NAME,
  EMAIL: process.env.SUPER_ADMIN_MAIL,
  PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
};
const mAccount = {
  withdrawalAccount: process.env.WITHDRAWAL_MACCOUNT,
  depositAccount: process.env.DEPOSIT_MACCOUNT,
};

// //// calendly
const calendly = {
  grantType: "authorization_code",
  code: process.env.CALENDLY_CODE,
  clientId: process.env.CALENDLY_CLIENT_ID,
  clientSecret: process.env.CALENDLY_CLIENT_SECRET,
  redirectUrl: process.env.CALENDLY_REDIRECT_URI,
  personalAccessToken: process.env.PERSONAL_ACCESS_TOKEN,
  tokenUrl: process.env.CALENDLY_TOKEN_URI,
};

module.exports = {
  urls,
  port,
  queuePort,
  allowedUrls,
  jwtOptions,
  emailCredentails,
  contactSupport,
  recaptcha,
  theresholdLimit,
  sumSubKeys,
  twoFaVerificationCode,
  token,
  currencyKeys,
  OffsetLimit,
  redis,
  webhookApiKey,
  testCredentials,
  adminCredentials,
  mAccount,
  calendly,
  raquel,
};
