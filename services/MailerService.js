const moment = require("moment");
const base64 = require("base-64");
const nodemailer = require("nodemailer");
const { urls, emailCredentails, raquel } = require("../config");
const { encoder, hideBSB, hideAccountNumber } = require("../utils");
const Errors = require("../errors");
const {
  Name,
  Subject,
  From,
  getFullName,
  IpChangedTemplate,
  UserAccountTemplate,
  ForgotPasswordTemplate,
  ResetPasswordTemplate,
  UserChangeEmailTemplate,
  UserChangeEmailNotificationTemplate,
  kycFirstDepositEmailTemplate,
  AdminInvitationTemplate,
  UserEddVerifiedEmailTemplate,
  depositTransactionInitialEmailTemplate,
  depositTransactionFollowUpEmailTemplate,
  depositTransactionFinalEmailTemplate,
  getCalendlyMeetUrl,
  depositConfirmationTemplate,
  depositRejectionTemplate,
  generatingWithdrawalReceiptPDF,
  withdrawConfirmationTemplate,
  kycApprovedEmailTemplate,
  kycRejectedEmailTemplate,
  withdrawCryptoConfirmationTemplate,
  resetBankEmailTemplate,
  scheduleMeetingTemplate,
} = require("../utils/mailer");
const Logger = require("../utils/Logger");
const { MailMessages } = require("../constants");

class MailerService {
  async sendEmail(email, subject, template, fileName = "", filePath = null) {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: emailCredentails.email,
          pass: emailCredentails.password,
        },
      });

      let mailOptions = {
        from: From,
        to: email,
        subject: subject,
        html: template,
      };

      if (fileName && filePath) {
        mailOptions.attachments = {
          filename: fileName,
          path: filePath,
        };
      }
      await transport.verify(function (error) {
        if (error) {
          Logger.error(error);
          return {
            code: 400,
          };
        } else {
          Logger.info(MailMessages.READY_TO_SEND_EMAIL);
        }
      });

      const resp = await transport.sendMail(mailOptions);
      Logger.info("Mail resp: ", resp);
      return {
        code: 200,
      };
    } catch (error) {
      Logger.error(error);
      return {
        code: 400,
      };
    }
  }
  async createdAccountMailer(user) {
    try {
      const site_url = urls.appUrl + "/confirmation";
      const data = {
        email: user.email,
        type: "user",
        id: user.id,
        dateTime: moment().valueOf(),
      };
      const token = await encoder(data);
      const url = `${site_url}/${token}`;
      const subject = "Welcome to Nebula - Start Your Trading Journey";

      const resp = await this.sendEmail(
        user.email,
        subject,
        UserAccountTemplate(getFullName(user), url, subject)
      );
      if (resp.code === 200) return token;
      else return null;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async forgotPasswordEmail(user, type = "user") {
    try {
      const site_url =
        (type === "user" ? urls.appUrl : urls.adminAppUrl) + "/reset-password";
      const data = {
        email: user?.email,
        id: user?.id,
        type: type,
        dateTime: moment().valueOf(),
        expireTime: moment().valueOf() + 86400000,
      };
      const token = await encoder(data);
      const url = `${site_url}/${token}`;
      const subject = "Password Reset Request for Your Account";
      const resp = await this.sendEmail(
        user.email,
        subject,
        ForgotPasswordTemplate(getFullName(user), url, subject)
      );
      if (resp.code === 200) return token;
      else return null;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }
  async passwordResetEmail(user) {
    try {
      const subject = "Your Password Has Been Successfully Updated";

      const currentDate = moment().format("DD-MM-YYYY");

      this.sendEmail(
        user?.email,
        subject,
        ResetPasswordTemplate(getFullName(user), subject, currentDate)
      );
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async changeEmail(user) {
    try {
      const site_url = urls.appUrl + "/change-email-verify";
      const data = {
        email: user.email,
        type: "user",
        id: user.id,
        dateTime: moment().valueOf(),
      };

      const token = await encoder(data);
      const url = `${site_url}/${token}`;
      const subject =
        "Action Required: Confirm Your New Email Address for Nebula";

      const resp = await this.sendEmail(
        user.email,
        subject,
        UserChangeEmailTemplate(getFullName(user), url, subject)
      );
      if (resp.code === 200) return token;
      else return null;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async changeEmailNotification(user) {
    try {
      const currentDate = moment().format("DD-MM-YYYY");

      const subject = "Confirmation of Email Address Change";

      const resp = await this.sendEmail(
        user.email,
        subject,
        UserChangeEmailNotificationTemplate(
          getFullName(user),
          currentDate,
          user.newUpdatedEmail
        )
      );
      return resp;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  /////////////////////////
  async sendInvitationEmail(user, type = "user") {
    try {
      const site_url = urls.appUrl + "/confirmation";
      const data = {
        email: user.email,
        type: type,
        id: user.id,
        dateTime: moment().valueOf(),
        expireTime: moment().valueOf() + 86400000,
      };

      const token = await encoder(data);
      const url = `${site_url}/${token}`;
      const subject = "Welcome to Nebula";

      const resp = await this.sendEmail(
        user.email,
        subject,
        AdminInvitationTemplate(url, getFullName(user), Subject)
      );
      if (resp.code === 200) return token;
      else return null;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendIpChangeEmailToUser(user) {
    try {
      const subject =
        "Important Security Alert: Change in IP Address Associated With Your Account";

      const res = await this.sendEmail(
        user.email,
        subject,
        IpChangedTemplate(getFullName(user), subject)
      );
      return res;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(
        MailMessages.UNABLE_TO_SEND_IP_CHANGED_EMAIL,
        {
          error: err,
          payload: { email: user?.email },
        }
      );
    }
  }

  async eddVerificationMail(user) {
    try {
      const subject =
        "Enhanced Due Diligence (EDD) Completion and Account Status Update";
      const resp = await this.sendEmail(
        user.email,
        subject,
        UserEddVerifiedEmailTemplate(getFullName(user), subject)
      );
      return resp;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }
  async sendInitialEmail(user, eddVerificationId) {
    try {
      const subject =
        "Immediate Attention Required: Compliance Verification for Recent Transaction";
      const email = user.contactEmail ? user.contactEmail : user.email;
      const template = depositTransactionInitialEmailTemplate(
        getFullName(user),
        subject,
        getCalendlyMeetUrl(user, eddVerificationId)
      );

      const emailResp = await this.sendEmail(email, subject, template);

      return emailResp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendFollowUpEmail(user, eddVerificationId) {
    try {
      const subject =
        "Important: Rescheduling Your Compliance Verification Meeting";
      const email = user.contactEmail ? user.contactEmail : user.email;
      const template = depositTransactionFollowUpEmailTemplate(
        getFullName(user),
        subject,
        getCalendlyMeetUrl(user, eddVerificationId)
      );
      const emailResp = await this.sendEmail(email, subject, template);

      return emailResp;
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendFinalEmail(user, eddVerificationId) {
    try {
      const subject =
        "Final Reminder: Immediate Action Required for Identity Verification";
      const email = user.contactEmail ? user.contactEmail : user.email;
      const template = depositTransactionFinalEmailTemplate(
        getFullName(user),
        subject,
        getCalendlyMeetUrl(user, eddVerificationId)
      );
      const emailResp = await this.sendEmail(email, subject, template);

      return emailResp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async kycFirstDepositEmail(user) {
    try {
      const subject =
        "Action Required: Complete Your Verification to Start Trading";
      const email = user.email;

      const resp = await this.sendEmail(
        email,
        subject,
        kycFirstDepositEmailTemplate(getFullName(user), subject)
      );

      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async userCreatedByAdminEmail(user) {
    try {
      const site_url = urls.appUrl + "/confirmation";
      const data = {
        email: user.email,
        type: "user",
        id: user.id,
        dateTime: moment().valueOf(),
      };
      const token = base64.encode(JSON.stringify(data));
      const url = `${site_url}/${token}`;
      const subject = "Welcome to Nebula - Start Your Trading Journey";
      const resp = await this.sendEmail(
        user.email,
        subject,
        UserAccountTemplate(getFullName(user), url, subject)
      );
      if (resp.code === 200) return token;
      else return null;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }
  async depositReceived(user, amount) {
    try {
      const subject = `Confirmation of Your ${amount} Deposit with Nebula`;
      let email = user?.contactEmail ? user.contactEmail : user.email;
      const template = depositConfirmationTemplate(
        getFullName(user),
        amount,
        subject
      );
      const resp = await this.sendEmail(email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }
  async depositRejected(user) {
    try {
      const subject = "Notice of Deposit Request Rejection";
      const template = depositRejectionTemplate(getFullName(user), subject);
      let email = user?.contactEmail ? user.contactEmail : user.email;
      const resp = await this.sendEmail(email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }
  async withdrawSubmitted(
    user,
    amount,
    date,
    description,
    id,
    bsb,
    accountNumber
  ) {
    try {
      const fileName =
        user.firstName + "-" + moment().valueOf() + "-receipt.pdf";
      const subject = "Withdrawal Confirmation - Your Transaction is Complete";
      const res = await generatingWithdrawalReceiptPDF(
        getFullName(user),
        date,
        amount,
        description,
        fileName,
        user.email ? user.email : "",
        user.contactNumber ? user.contactNumber : ""
      );

      await this.sendEmail(
        user.email,
        subject,
        withdrawConfirmationTemplate(
          getFullName(user),
          amount,
          subject,
          hideBSB(bsb),
          hideAccountNumber(accountNumber)
        ),
        fileName,
        res.filename
      );
      return { fileName };
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendKycApprovedEmailToUser(user, date) {
    try {
      const subject = "KYC Verification Successful";
      const template = kycApprovedEmailTemplate(getFullName(user), date);
      const resp = await this.sendEmail(user.email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendKycRejectedEmailToUser(user) {
    try {
      const subject = "KYC Verification Update";
      const template = kycRejectedEmailTemplate(getFullName(user));
      const resp = await this.sendEmail(user.email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendWithdrawCryptoConfirmationToUser(user, amount, currency, txid) {
    try {
      const subject = "Withdrawal Confirmation - Your Transaction is Complete";
      const template = withdrawCryptoConfirmationTemplate(
        getFullName(user),
        amount,
        currency,
        txid
      );
      const resp = await this.sendEmail(user.email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendResetBankEmailToUser(user) {
    try {
      const subject = "Withdrawal Bank Reset Confirmation";
      const template = resetBankEmailTemplate(getFullName(user));
      const resp = await this.sendEmail(user.email, subject, template);
      return resp;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: user?.email },
      });
    }
  }

  async sendRaquelEmailOfCreateEventSlot(slot) {
    try {
      const subject = "New event slot created";
      const res = await this.sendEmail(
        raquel.email,
        subject,
        scheduleMeetingTemplate(slot, subject)
      );
      return res;
    } catch (err) {
      throw new Errors.InternalServerError(MailMessages.UNABLE_TO_SEND_EMAIL, {
        error: err,
        payload: { email: raquel.email },
      });
    }
  }
}
module.exports = { MailerService };
