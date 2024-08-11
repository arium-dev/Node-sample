const Errors = require("../../../errors");
const {
  QueueSubType,
  GenericMessages,
  UserMessages,
  HttpStatusCode,
} = require("../../../constants");
const {
  CurrencyFormattor,
  FormatTwoDecimals,
} = require("../../../utils/parser");
const { formatDateOnly } = require("../../../utils");
const { urls } = require("../../../config");
const { Transaction } = require("../../../models/Transaction");

async function sendMails(
  body,
  {
    userRepository,
    mailerService,
    eddVerificationRepository,
    roleRepository,
    userPreferenceRepository,
    transactionRepository,
  }
) {
  if (!body?.data?.userId) {
    throw new Errors.BadRequest(GenericMessages.ID_IS_INVALID);
  }
  const user = await userRepository.findById(body?.data?.userId);
  if (!user) {
    throw new Errors.BadRequest(UserMessages.USER_NOT_FOUND);
  }

  await handleMailing(body, user, {
    userRepository,
    roleRepository,
    mailerService,
    userPreferenceRepository,
    eddVerificationRepository,
    transactionRepository,
  });

  return {
    code: HttpStatusCode.OK,
  };
}

async function handleMailing(
  body,
  user,
  {
    userRepository,
    roleRepository,
    mailerService,
    userPreferenceRepository,
    eddVerificationRepository,
    transactionRepository,
  }
) {
  switch (body.subType) {
    case QueueSubType.CREATE_ACCOUNT:
      await handleCreateAccount(user, userRepository, mailerService);
      break;

    case QueueSubType.CHANGE_IP_ADDRESS:
      await handleChangeIpAddress(user, mailerService);
      break;

    case QueueSubType.FORGOT_PASSWORD:
      await handleForgotPassword(
        user,
        userRepository,
        roleRepository,
        mailerService
      );
      break;

    case QueueSubType.PASSWORD_RESET:
      await handlePasswordReset(
        user,
        userRepository,
        mailerService,
        roleRepository
      );
      break;

    case QueueSubType.PASSWORD_RESET_SUCCESS:
      await handlePasswordResetEmail(user, mailerService);
      break;

    case QueueSubType.CHANGE_EMAIL:
      await handleChangeEmail(user, body.data, userRepository, mailerService);
      break;

    case QueueSubType.CHANGE_EMAIL_NOTIFICATION:
      await handleChangeEmailNotification(user, body.data, mailerService);
      break;

    case QueueSubType.INVITE_RECIPIENT:
      await handleInviteRecipient(user, userRepository, mailerService);
      break;

    case QueueSubType.KYC_ALERT_EMAIL:
      await handleKycAlertEmail(user, userPreferenceRepository, mailerService);
      break;

    case QueueSubType.DEPOSIT_RECEIVED:
      await handleDepositReceivedEmail(user, body?.data?.amount, mailerService);
      break;

    case QueueSubType.INITIAL_EMAIL:
      await handleSendInitialEmail(
        user,
        body?.data?.eddVerificationId,
        eddVerificationRepository,
        mailerService
      );
      break;

    case QueueSubType.FOLLOW_UP_EMAIL:
      await handleSendFollowupEmail(
        user,
        body?.data?.eddVerificationId,
        eddVerificationRepository,
        mailerService
      );
      break;

    case QueueSubType.FINAL_EMAIL:
      await handleSendFinalEmail(
        user,
        body?.data?.eddVerificationId,
        eddVerificationRepository,
        mailerService
      );
      break;

    case QueueSubType.KYC_APPROVED_MAIL:
      await handleKycApprovedMail(user, body?.data?.createdAt, mailerService);
      break;

    case QueueSubType.KYC_REJECTED_MAIL:
      await handleKycRejectedMail(user, mailerService);
      break;

    case QueueSubType.WITHDRAW_APPROVED_MAIL:
      await handleWithdrawApprovedMail(
        user,
        body.data,
        transactionRepository,
        mailerService
      );
      break;
    case QueueSubType.DEPOSIT_APPROVED_MAIL:
      await handleDepositApprovedMail(
        user,
        body.data,
        transactionRepository,
        mailerService
      );
      break;

    case QueueSubType.DEPOSIT_REJECTED_MAIL:
      await handleDepositRejectedMail(
        user,
        body.data,
        transactionRepository,
        mailerService
      );
      break;

    case QueueSubType.CALENDLY_BOOKED_MAIL:
      await handleCalendlyBookedMail(
        body.data,
        eddVerificationRepository,
        mailerService
      );
      break;

    default:
      throw new Errors.BadRequest(GenericMessages.UNSUPPORTED_MAIL);
  }
}

async function handleCreateAccount(user, userRepository, mailerService) {
  const emailToken = await mailerService.createdAccountMailer(user);
  if (!emailToken) {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
  user.emailToken = emailToken;
  await userRepository.save(user);
}

async function handleChangeIpAddress(user, mailerService) {
  await mailerService.sendIpChangeEmailToUser(user);
}

async function handleForgotPassword(
  user,
  userRepository,
  roleRepository,
  mailerService
) {
  const role = await roleRepository.findById(user?.roleId);
  const emailToken = await mailerService.forgotPasswordEmail(user, role?.name);
  if (!emailToken) {
    throw new Errors.BadGateway(GenericMessages.EMAIL_SENDING_FAILED);
  }
  user.emailToken = emailToken;
  await userRepository.save(user);
}

async function handlePasswordReset(
  user,
  userRepository,
  mailerService,
  roleRepository
) {
  const role = await roleRepository.findById(user?.roleId);
  const changePassToken = await mailerService.forgotPasswordEmail(
    user,
    role?.name
  );

  if (!changePassToken) {
    throw new Errors.BadGateway(
      UserMessages.USER_CHANGE_PASSWORD_REQUEST_FAILED
    );
  }
  user.emailToken = changePassToken;
  await userRepository.save(user);
}

async function handlePasswordResetEmail(user, mailerService) {
  await mailerService.passwordResetEmail(user);
}

async function handleChangeEmail(user, body, userRepository, mailerService) {
  const changeEmailToken = await mailerService.changeEmail({
    ...user,
    email: body.email,
  });
  if (!changeEmailToken) {
    throw new Errors.BadGateway(UserMessages.USER_CHANGE_EMAIL_REQUEST_FAILED);
  }
  user.emailToken = changeEmailToken;
  await userRepository.save(user);
}

async function handleChangeEmailNotification(user, body, mailerService) {
  await mailerService.changeEmailNotification({ ...user, ...body });
}

async function handleInviteRecipient(user, userRepository, mailerService) {
  const emailToken = await mailerService.createdAccountMailer(user);
  if (!emailToken) {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
  user.emailToken = emailToken;
  await userRepository.save(user);
}

async function handleKycAlertEmail(
  user,
  userPreferenceRepository,
  mailerService
) {
  const userPreference = await userPreferenceRepository.findOne({
    userId: user.id,
  });

  if (!(userPreference && userPreference.id)) {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
  await mailerService.kycFirstDepositEmail(user);

  // update user preference
  userPreference.deposit.isKycAlertEmail = true;
  await userPreferenceRepository.save(userPreference);
  return true;
}

async function handleDepositReceivedEmail(user, amount = 0, mailerService) {
  return await mailerService.depositReceived(
    user,
    CurrencyFormattor(parseFloat(amount))
  );
}

async function handleSendInitialEmail(
  user,
  eddVerificationId = "",
  eddVerificationRepository,
  mailerService
) {
  const resp = await mailerService.sendInitialEmail(user, eddVerificationId);
  if (resp) {
    const eddVerification = await eddVerificationRepository.findById(
      eddVerificationId
    );
    eddVerification.emailStatus = 1;
    await eddVerificationRepository.save(eddVerification);
    return true;
  } else {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
}

async function handleSendFollowupEmail(
  user,
  eddVerificationId = "",
  eddVerificationRepository,
  mailerService
) {
  const resp = await mailerService.sendFollowUpEmail(user, eddVerificationId);
  if (resp) {
    const eddVerification = await eddVerificationRepository.findById(
      eddVerificationId
    );
    eddVerification.emailStatus = 2;
    await eddVerificationRepository.save(eddVerification);
    return true;
  } else {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
}

async function handleSendFinalEmail(
  user,
  eddVerificationId = "",
  eddVerificationRepository,
  mailerService
) {
  const resp = await mailerService.sendFinalEmail(user, eddVerificationId);
  if (resp) {
    const eddVerification = await eddVerificationRepository.findById(
      eddVerificationId
    );
    eddVerification.emailStatus = 3;
    await eddVerificationRepository.save(eddVerification);
    return true;
  } else {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }
}

async function handleKycApprovedMail(user, createdAt, mailerService) {
  await mailerService.sendKycApprovedEmailToUser(
    user,
    formatDateOnly(createdAt)
  );
}

async function handleKycRejectedMail(user, mailerService) {
  await mailerService.sendKycRejectedEmailToUser(user);
}

async function handleWithdrawApprovedMail(
  user,
  data,
  transactionRepository,
  mailerService
) {
  let withdraw = await transactionRepository.findOne(
    {
      _id: data.transactionId,
    },
    ["user", "wallet"]
  );

  const wallet = (withdraw?.wallet && withdraw?.wallet[0]) || "";
  if (!(withdraw && wallet)) {
    throw new Errors.BadRequest(UserMessages.EMAIL_NOT_SENT);
  }

  // sending email to the user
  const { fileName } = await mailerService.withdrawSubmitted(
    user,
    CurrencyFormattor(parseFloat(withdraw?.amount)),
    withdraw?.updatedAt,
    withdraw?.transactionDetails?.refId,
    withdraw?.id,
    wallet?.data?.bsb,
    wallet?.data?.accountNumber
  );

  withdraw.transactionDetails.receipt = `${urls.serverUrl}/api/withdrawals/receipt/${fileName}`;
  withdraw = new Transaction(withdraw);
  return await transactionRepository.save(withdraw);
}

async function handleDepositApprovedMail(
  user,
  { transactionId },
  transactionRepository,
  mailerService
) {
  const transaction = await transactionRepository.findById(transactionId);

  return await mailerService.depositReceived(
    user,
    CurrencyFormattor(parseFloat(FormatTwoDecimals(transaction.amount)))
  );
}

async function handleDepositRejectedMail(
  user,
  { transactionId },
  transactionRepository,
  mailerService
) {
  const transaction = await transactionRepository.findById(transactionId);

  return await mailerService.depositRejected(
    user,
    CurrencyFormattor(parseFloat(FormatTwoDecimals(transaction.amount)))
  );
}

async function handleCalendlyBookedMail(
  { transactionId },
  eddVerificationRepository,
  mailerService
) {
  const eddVerification = await eddVerificationRepository.findById(
    transactionId
  );

  return await mailerService.sendRaquelEmailOfCreateEventSlot(eddVerification);
}

module.exports = { sendMails };
