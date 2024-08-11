const express = require("express");
const { UserRepository } = require("../../../repositories/UserRepository");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const {
  EddVerificationRepository,
} = require("../../../repositories/EddVerificationRepository");
const { MailerService } = require("../../../services/MailerService");
const { handle } = require("../../../utils/asyncHandler");
const { sendMails } = require("../../../useCases/queue/mails");

const app = express.Router();

app.post(
  "/",
  handle(async (req, res) => {
    const resp = await sendMails(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
      eddVerificationRepository: new EddVerificationRepository(),
      userPreferenceRepository: new UserPreferenceRepository(),
      transactionRepository: new TransactionRepository(),
      mailerService: new MailerService(),
    });

    res.json(resp);
  })
);

module.exports = app;
