const moment = require("moment");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const base64 = require("base-64");
const { urls } = require("../../config");
const logoExpanded = `${urls.appUrl}/images/nebula-email-logo-expanded.png`;
const logoCollapsed = `${urls.appUrl}/images/nebula-email-logo-shrinked.png`;
const Subject = "Welcome to Nebula Payments";
const Name = "Nebula Payments";
const From = `Nebula Payments<emailCredentails.email>`;
const currentYear = moment().format("yyyy");
const { contactSupport } = require("../../config");
const Disclaimer = `This email (and any attachment) is confidential and intended solely for the use of the addressee. If you are not the intended recipient or responsible for delivering this email to the addressee, please refrain from disclosing, distributing, printing, or copying the contents. The information contained herein must be kept strictly confidential. If you received this email in error, please notify us immediately at ${contactSupport.email} and delete the original message. Please be aware that electronic mail is not secure, and there is a risk of transmission errors or corruption. It is your responsibility to carefully review this email (and any attachment) for errors, and if any are found, please contact us immediately. We assume no liability for loss or damage caused by security breaches or transmission errors.`;

const parseNull = (val) => {
  return val ? val : "";
};

const getFullName = (user) => {
  return user ? parseNull(user.firstName) + " " + parseNull(user.lastName) : "";
};

const EmailWrapper = (template) => `
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="font-family: 'Roboto'">
    <div
      style="
        top: -703px;
        left: -1958px;
        padding: 30px 50px 50px 50px;
        gap: 20px;

        background: linear-gradient(
          90deg,
          #e5dff3 0%,
          #e5dff3 72.57%,
          #362465 72.6%,
          #362465 100%
        );
      "
    >
    <div style="padding-bottom: 40px">
      <div style="float: left; padding-top: 10px">
        <img
          style="width: 252; height: 30px"
          src=${logoExpanded}
          alt="logo-expanded"
        />
      </div>
      <div style="float: right">
        <img
          style="width: 60px; height: 46px"
          src=${logoCollapsed}
          alt="logo-shrinked"
        />
      </div>
    </div>

      <div
        style="
          background-color: #f4efff;
          margin-top: 20px;
          border-radius: 20px;
          padding: 10px 20px;
        "
      >
        <div>${template}</div>

        <div
          style="
            background: #9568ff;
            color: #ffffff;
            height: 35px;
            text-align: center"
          "
        >
          <p style="font-size: 10px; font-weight: 400; color: #ffffff; padding: 10px;">
            © ${currentYear} NebulaPayments. All rights reserved.
          </p>
        </div>

        <div style="text-align: center">
          <p
            style="
              font-size: 10px;
              font-weight: 400;
              line-height: 15px;
              font-size: #000000;
            "
          >
           ${Disclaimer}
          </p>
        </div>
      </div>

      <div
        style="
          text-align: center";
          font-size: 14px;
          font-weight: 600;
        "
      >
        <p
          style="
            color: #9568ff;
            font-size: 14px;
            font-weight: 600;
            line-height: 22px;
          "
        >
          NebulaPayments
        </p>
      </div>
    </div>
  </body>
</html>
`;

const UserAccountTemplate = (Name, url) => {
  const template = `
  <p
  style="
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    color: #9568ff;
  "
>
  Dear ${Name},
</p>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  It’s our pleasure to welcome you aboard Nebula, where innovation
  meets trading excellence. As the newest member of our
  distinguished community, you stand on the threshold of a trading
  adventure, empowered by our state-of-the-art tools and resources.
</p>

<p
  style="
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: #000000;
  "
>
  Embark on Your Nebula Journey:
</p>

<ul>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Activate Your Account: Begin by utilizing the dedicated bank
    accounts set up for you. Our integrated PayID & Osko solutions
    make deposits swift and seamless.
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Kickstart Your Trading: Make your initial deposit to dive into
    the vibrant world of trading.
  </li>
</ul>

<div style="text-align: center">
  <a href=${url}
    style="
      display: inline-block;
      width: 138.8px;
      height: 39.2px;
      background-color: #9568ff;
      color: #ffffff;
      border-radius: 10px;
      font-weight: 400;
      font-size: 12px;
      line-height: 39.2px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      margin-top: 10px;
    "
  >
    Activate your account
  </a>
</div>


<p
  style="
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: #000000;
  "
>
  Discover More with Nebula:
</p>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  Our platform offers more than just transactional capabilities.
  Dive into the Accounts screen to uncover comprehensive insights
  into your financial activities and unlock new dimensions of money
  management.
</p>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  We are here to ensure a superior trading journey, offering the
  tools and support needed to navigate the markets confidently. For
  any inquiries or feedback, reach out to us at
  <span
    style="
      color: #9568ff;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
    "
    >${contactSupport.email}</span
  >
</p>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  If you didn’t initiate the request, you can safely ignore the mail
</p>

<div>
  <p
    style="
      font-size: 14px;
      font-weight: 400;
      color: #374557;
      margin-bottom: 0px;
    "
  >
    Warm Regards,
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      color: #9568ff;
      margin-top: 0px;
    "
  >
    The Nebula Team
  </p>
</div>
      `;
  return EmailWrapper(template);
};

const ForgotPasswordTemplate = (Name, url) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We've received a request to reset the password for your account.
      Your security is our top priority, and we're here to assist you
      every step of the way.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      To reset your password, simply click the button below:
    </p>

  <div style="text-align: center">
    <a href=${url}
      style="
        display: inline-block;
        width: 138.8px;
        height: 39.2px;
        background-color: #9568ff;
        color: #ffffff;
        border-radius: 10px;
        font-weight: 400;
        font-size: 12px;
        line-height: 39.2px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        margin-top: 10px;
      "
    >
      Reset Password
    </a>
  </div>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      If you did not initiate this request, there's no need to worry.
      You can safely ignore this email, and your password will remain
      secure and unchanged. No further action is required on your part.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Should you have any questions or if there's anything more we can
      do to support you, our customer care team is ready and waiting.
      Contact us at any time at
      <span
        style="
          color: #9568ff;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        "
        >${contactSupport.email}</span
      >
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We appreciate your prompt attention to ensuring the security of
      your account.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Warm Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Team
      </p>
    </div>
    `;
  return EmailWrapper(template);
};

const UserChangeEmailTemplate = (Name, url) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      As part of our ongoing commitment to ensure the security and
      integrity of our users' accounts, we kindly ask you to verify your
      recent request to change your email address. This step is crucial
      to maintain the security of your account and to ensure that you
      can recover your account in the future if needed.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Please click the button below to verify your new email address and
      login to your account:
    </p>

    <div style="text-align: center">
      <a href=${url}
        style="
          display: inline-block;
          width: 138.8px;
          height: 39.2px;
          background-color: #9568ff;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 400;
          font-size: 12px;
          line-height: 39.2px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin-top: 10px;
        "
      >
        Verify & Login
      </a>
    </div>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Your trust and security are paramount to us. If you have any
      questions or encounter any issues, please do not hesitate to reach
      out to our support team at
      <span
        style="
          color: #9568ff;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        "
        >${contactSupport.email}</span
      >
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We appreciate your prompt attention to ensuring the security of
      your account.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
      The Nebula Security Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

const UserChangeEmailNotificationTemplate = (
  Name,
  currentDate,
  newUpdatedEmail
) => {
  const template = `
        <p
        style="
          font-size: 14px;
          font-weight: 500;
          line-height: 32px;
          color: #9568ff;
        "
      >
        Dear ${Name},
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        We are reaching out to confirm that your email address associated with your Nebula account has been successfully updated. As of ${currentDate}, your primary email for notifications and communications has been changed to ${newUpdatedEmail}.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
      If you did not initiate this change or if you notice any discrepancies, please contact our support team immediately at ${contactSupport.email}. Your account security is very important to us.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
      For any further assistance, feel free to reach out. We're here to help!
      </p>

      <div>
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            color: #374557;
            margin-bottom: 0px;
          "
        >
          Kind Regards,
        </p>

        <p
          style="
            font-size: 14px;
            font-weight: 400;
            color: #9568ff;
            margin-top: 0px;
          "
        >
          Nebula Accounts Team
        </p>
      </div>
      `;
  return EmailWrapper(template);
};

///////////////////
const depositConfirmationTemplate = (Name, amount, subject) => {
  const template = `
  <p
  style="
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    color: #9568ff;
  "
>
  Dear ${Name},
</p>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  We're reaching out to confirm the successful receipt of your
  deposit amounting to ${amount} into your Nebula account. While no
  immediate action is required from your end, we urge you to review
  the following critical information carefully to ensure
  transparency and security around this transaction.
</p>

<p
  style="
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: #000000;
  "
>
  Transaction Details:
</p>

<ul>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Amount Deposited: ${amount}
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Purpose: Trading
  </li>
</ul>

<p
  style="
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: #000000;
  "
>
  Next Steps and Important Notices:
</p>

<ul>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    <span style="font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #374557;">Verification:</span> This email verifies that the deposit was
    authorized by you for the specific purpose mentioned above. If
    you have any inquiries or require further clarification about
    this transaction, please do not hesitate to get in touch with us
    directly by replying to this email.
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    <span style="font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #374557;">Prompt Communication:</span> In the event of any change in
    circumstances or if you have any concerns regarding this
    transaction, please contact us immediately. Prompt communication
    enables us to serve you better and address any issues
    efficiently.
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    <span style="font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #374557;">Fraudulent Activity Concerns:</span> We are aware of the increasing
    concerns regarding online identity theft and fraud. If you
    believe this transaction was made without your authorization,
    please respond to this email without delay. Providing details of
    your concern will allow us to take swift action to safeguard
    your interests.
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    <span style="font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #374557;">Transaction Execution:</span> If we do not hear from you within 24
    hours from the time this email was sent, we will proceed with
    the execution of your purchase as planned. Your non-response
    will be taken as confirmation of your consent to this
    transaction, thereby authorizing Nebula to act as your payment
    agent.
  </li>
  <li
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    <span style="font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #374557;">Dispute Resolution:</span> Should you wish to dispute this transaction
    after its completion, you are encouraged to contact us directly
    via this email. Our commitment to our customers includes
    ensuring a fair and just resolution to any concerns, with a
    dedicated team ready to address and resolve your issues promptly
    and fairly.
  </li>
</ul>

<p
  style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
  "
>
  Your trust and security are paramount to us. Thank you for
  choosing Nebula. We are here to support your financial journey
  with transparency and integrity.
</p>

<div>
  <p
    style="
      font-size: 14px;
      font-weight: 400;
      color: #374557;
      margin-bottom: 0px;
    "
  >
    Kind Regards,
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      color: #9568ff;
      margin-top: 0px;
    "
  >
    The Nebula Team
  </p>
</div>
 `;
  return EmailWrapper(template);
};

const depositRejectionTemplate = (Name, subject) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We regret to inform you that, after a thorough review, we are
      unable to proceed with processing your deposit request at this
      time. We understand that this decision may come as a
      disappointment, and we extend our sincerest apologies for any
      inconvenience this may cause.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      At Nebula, we take our review process seriously, ensuring that all
      transactions align with our operational guidelines and regulatory
      requirements. This decision reflects our commitment to maintaining
      the highest standards of service and security for all our clients.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Next Steps:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      To facilitate the return of your funds to the originating account,
      we kindly ask you to provide us with the necessary details
      regarding the preferred method for the transaction reversal. Our
      team is prepared to assist you in ensuring a smooth and prompt
      return of your deposit.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Further Assistance:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Should you require further clarification on this matter or if you
      have additional questions, please do not hesitate to reach out to
      us directly. Our team is here to provide you with the support and
      information you need to understand our decision and explore
      alternative solutions that may suit your needs better.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We value your interest in our services and hope that you will
      consider Nebula for your future financial endeavors. Thank you for
      your understanding and cooperation.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Compliance Team
      </p>
    </div>
 `;
  return EmailWrapper(template);
};

const IpChangedTemplate = (name, subject) => {
  const template = `
  <p
  style="
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: #9568ff;
  "
  >
  Dear ${name},
</p>
<p
  style="
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #374557;
  "
  >
  We are reaching out to inform you of a recent change in the IP
  address linked to your account. This notification serves as part
  of our ongoing efforts to ensure the security and privacy of your
  account information.
</p>
<p
  style="
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  color: #000000;
  "
  >
  Action Required:
</p>
<ul>
  <li
    style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
    "
    >
    If you recognize this change as one you initiated or authorized
    (such as logging in from a different location or device), no
    further action is needed. You can simply disregard this message.
  </li>
  <li
    style="
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #374557;
    "
    >
    If this change was not made by you, it is crucial to immediately
    review your account for any unusual or unauthorized activity.
    This may indicate that your account security has been
    compromised.
  </li>
</ul>
<p
  style="
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  color: #000000;
  "
  >
  Need Assistance?
</p>
<p
  style="
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #374557;
  "
  >
  Our support team is on standby to assist you with any concerns or to answer any questions you might have regarding this matter. Please do not hesitate to reach out to us for help in securing your account.
</p>
  <p
  style="
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #374557;
  "
  >
  <span style="
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  color: #374557;
  ">Contact Support:<span/> ${contactSupport.email}
</p>
<p
  style="
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #374557;
  "
  >
  Thank you for your prompt attention to this important security notice. We are committed to providing you with a safe and secure user experience.
</p>
<div>
  <p
    style="
    font-size: 14px;
    font-weight: 400;
    color: #374557;
    margin-bottom: 0px;
    "
    >
    Kind Regards,
  </p>
  <p
    style="
    font-size: 14px;
    font-weight: 400;
    color: #9568ff;
    margin-top: 0px;
    "
    >
    The Nebula Security Team
  </p>
</div>
  `;
  return EmailWrapper(template);
};

const AdminInvitationTemplate = (url, name, subject) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
    An admin account has been created for you on the Nebula Portal.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
    Click the button below to accept the invitation.
    </p>

    <div style="text-align: center">
      <a href=${url}
        style="
          display: inline-block;
          width: 138.8px;
          height: 39.2px;
          background-color: #9568ff;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 400;
          font-size: 12px;
          line-height: 39.2px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin-top: 10px;
        "
      >
        Activate your account
      </a>
    </div>

    <p
      style="
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        color: #374557;
      "
    >
    This invitation will expire within 24hrs.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Warm Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        Nebula Accounts Team
      </p>
    </div>
  `;
  return EmailWrapper(template);
};

const ResetPasswordTemplate = (name, subject, currentDate) => {
  const template = `
    <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
        We're confirming that the password for your Nebula account was successfully updated on ${currentDate}. You can now use your new password to access your account.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
    If you did not make this change or if you have any concerns about your account security, please contact us immediately at ${contactSupport.email}. It's important to us that your account remains secure and accessible only to you.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
    Should you need any further assistance, or have any questions, please don't hesitate to reach out. Our support team is here to help!
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        Nebula Accounts Team
      </p>
    </div>
    `;
  return EmailWrapper(template);
};

const kycFirstDepositEmailTemplate = (Name, subject) => {
  const template = `
  <h3 style="font-size: 18px; ">Dear ${Name}</h3> 
  <p>
  We're excited to have you on board and are looking forward to supporting your trading journey. To ensure a secure and compliant trading environment, we require all our customers to complete the Know Your Customer (KYC) process. This is a one-time verification that helps us maintain the highest standards of financial security and counteract fraud. 
</p>
<p> As of now, your initial deposit has been successfully received, and you're just one step away from unlocking the full trading capabilities on our platform.</p>

<div style="text-align: center">
  <a href=${`${urls.appUrl}/dashboard?startKYC=true`}
    style="
      display: inline-block;
      width: 138.8px;
      height: 39.2px;
      background-color: #9568ff;
      color: #ffffff;
      border-radius: 10px;
      font-weight: 400;
      font-size: 12px;
      line-height: 39.2px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      margin-top: 10px;
    "
  >
    Complete Verification
  </a>
</div>

<p>Completing your KYC is crucial to access all the trading features, including withdrawals and deposits beyond your initial amount. Your information is securely processed and stored in accordance with our privacy policy.</p>
<p>Should you have any questions or need assistance during the KYC process, please feel free to reach out to our customer support team at ${
    contactSupport.email
  } or through our live chat on the website. We're here to help!</p>
<p>Thank you for your prompt attention to this matter.
</p>
      `;
  return EmailWrapper(template);
};

const UserEddVerifiedEmailTemplate = (Name, subject) => {
  const template = `
    <p
    style="
      font-size: 14px;
      font-weight: 500;
      line-height: 32px;
      color: #9568ff;
    "
  >
    Dear ${Name},
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    We are pleased to inform you that our Compliance Team has
    successfully completed the Enhanced Due Diligence (EDD) process
    for your account. Based on the thoroughness of the information
    you've provided, we have ensured that your account access is now
    fully restored and operational.
  </p>

  <p
    style="
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      color: #000000;
    "
  >
    Important Note:
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Please be aware that future transactions may prompt additional
    automated EDD checks as part of our ongoing commitment to
    maintaining a secure and compliant financial environment. Rest
    assured, our team is dedicated to assisting you with any
    requirements or steps that may arise from these procedures.
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    We are excited to continue supporting your financial endeavors
    through our services. Remember, our Support Team is always
    available to assist you with any inquiries or support you might
    need at any time.
  </p>

  <p
    style="
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #374557;
    "
  >
    Thank you for your cooperation and for choosing Nebula. We look
    forward to facilitating your success and ensuring a secure,
    seamless experience with our services.
  </p>

  <div>
    <p
      style="
        font-size: 14px;
        font-weight: 400;
        color: #374557;
        margin-bottom: 0px;
      "
    >
      Kind Regards,
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        color: #9568ff;
        margin-top: 0px;
      "
    >
      The Nebula Compliance Team
    </p>
  </div>
  `;
  return EmailWrapper(template);
};

const depositTransactionInitialEmailTemplate = (Name, subject, url) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      As part of our commitment to adhere to global compliance standards
      and maintain the integrity of our financial transactions, Nebula
      is conducting an Enhanced Due Diligence (EDD) check in relation to
      a recent activity noted in your account. This process is crucial
      for fulfilling our Customer Due Diligence (CDD) obligations under
      the Know Your Customer (KYC) framework.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Action Required:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We require your assistance to confirm the details of your recent
      deposit made via our online platform and to verify your identity.
      This involves providing one of the following documents during a
      short video conference with a member of our Compliance Team:
    </p>

    <ul>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        Australian Driver's License, or;
      </li>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        Australian Passport.
      </li>
    </ul>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Scheduling the Video Conference:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Please use the link below to select a time slot that suits your
      schedule for the video conference:
    </p>

    <div style="text-align: center">
        <a href=${url}
          style="
            display: inline-block;
            width: 138.8px;
            height: 39.2px;
            background-color: #9568ff;
            color: #ffffff;
            border-radius: 10px;
            font-weight: 400;
            font-size: 12px;
            line-height: 39.2px;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            margin-top: 10px;
          "
        >
          Book Now
        </a>
      </div>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      The video call is expected to last approximately 5-8 minutes.
      During this session, we will verify the mentioned document(s) and
      discuss the transaction in question.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Important:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        color: #374557;
      "
    >
      Please be aware that non-compliance with this verification process
      may lead to temporary restrictions or limitations on the services
      available to you through Nebula.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We appreciate your prompt attention to this matter and your
      cooperation in ensuring a secure and compliant trading
      environment.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Should you have any questions or require further clarification, do
      not hesitate to reach out to us.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Thank you for your cooperation and understanding.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Compliance Team
      </p>
    </div>
  `;
  return EmailWrapper(template);
};

const depositTransactionFollowUpEmailTemplate = (Name, subject, url) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We noted that our recent scheduled video conference, essential for
      the transaction confirmation and compliance verification process,
      was not attended. As maintaining regulatory compliance and the
      integrity of our business operations is of utmost importance, your
      participation in this process is critically needed.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      To Reschedule Your Meeting:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We understand that unforeseen circumstances can arise, impacting
      your ability to attend previously scheduled meetings. To
      facilitate the completion of this vital compliance step, please
      provide us with your preferred dates and times for a rescheduled
      meeting or click the link below to rebook. We will endeavor to
      accommodate your schedule to the best of our ability. Reschedule here:
    </p>

    <div style="text-align: center">
      <a href=${url}
        style="
          display: inline-block;
          width: 138.8px;
          height: 39.2px;
          background-color: #9568ff;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 400;
          font-size: 12px;
          line-height: 39.2px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin-top: 10px;
        "
      >
        Book Now
      </a>
    </div>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Open Communication Channel:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We emphasize the importance of clear and open communication in
      ensuring compliance and fostering trust within our relationship.
      Should you have any concerns, questions, or if there were specific
      reasons that prevented your attendance, please feel free to share
      them. Your insights will assist us in better understanding your
      situation and how we can support you through the compliance
      process.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Your Next Steps Are Critical:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Please select a new meeting time at your earliest convenience to
      ensure we can promptly finalize the compliance verification and
      continue our business relationship without interruptions.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We appreciate your immediate attention to this matter and your
      cooperation in adhering to these necessary regulatory
      requirements.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Thank you for your understanding and prompt action. We look
      forward to your participation and are here to support you through
      this process.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Compliance Team
      </p>
    </div>
  `;
  return EmailWrapper(template);
};

const depositTransactionFinalEmailTemplate = (Name, subject, url) => {
  const template = `
      <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      This communication serves as an urgent reminder concerning the
      recent deposit transaction in your Nebula account. To align with
      our commitment to regulatory compliance and to finalize the
      processing of your transaction, we must verify your identity.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Immediate Action Required:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      To avoid any disruptions in your service, we request the
      submission of the necessary identification documents during our
      upcoming due diligence call. It is imperative that this step is
      completed promptly.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      <span
        style="
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          color: #000000;
        "
      >
        This is your final notice before we are compelled to initiate
        temporary restrictions on your account.</span
      >
      The deadline for providing the requested information is within the
      next 48 hours.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We prioritize the security of your account and the adherence to
      regulatory standards. Your cooperation is essential in confirming
      your identity and ensuring our platform remains secure and
      trustworthy for all users.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Schedule Your Verification Meeting:
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Please book your due diligence call using the link below at the
      earliest opportunity:
    </p>

    <div style="text-align: center">
      <a href=${url}
        style="
          display: inline-block;
          width: 138.8px;
          height: 39.2px;
          background-color: #9568ff;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 400;
          font-size: 12px;
          line-height: 39.2px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin-top: 10px;
        "
      >
        Book Now
      </a>
    </div>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Need Assistance?
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      If you have any concerns or require additional support, our
      dedicated support team is on standby. Contact us at
      <span
        style="
          color: #9568ff;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        "
        >${contactSupport.email}</span
      >
      for guidance or with any questions you might have about this
      process.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We appreciate your immediate attention to this critical matter.
      Your prompt response is vital in maintaining the integrity and
      security of our platform.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      Thank you for your understanding and cooperation.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Compliance Team
      </p>
    </div>
  `;
  return EmailWrapper(template);
};

const WithDrawalReceiptTemplate = (
  name,
  date,
  amount,
  description,
  email,
  phone
) =>
  `<!DOCTYPE html>
  <!DOCTYPE html>
  
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body
      style="
        font-family: Roboto, Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        width: 100vw;
      "
    >
      <div
        style="
          padding: 30px 50px 50px 50px;
          gap: 20px;
          height: 100%;
          background: linear-gradient(
            90deg,
            #e5dff3 0%,
            #e5dff3 72.57%,
            #362465 72.6%,
            #362465 100%
          );
        "
      >
        <div style="padding-bottom: 40px">
          <div style="float: left; padding-top: 10px">
            <img
              style="width: 252; height: 30px"
              src="${logoExpanded}"
              alt="logo-expanded"
            />
          </div>
          <div style="float: right">
            <img
              style="width: 60px; height: 46px"
              src=${logoCollapsed}
              alt="logo-shrinked"
            />
          </div>
        </div>
  
        <div
          style="
            background-color: #f4efff;
            margin-top: 20px;
            border-radius: 20px;
            padding: 10px 20px;
          "
        >
          <div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <p
                style="
                  font-size: 20px;
                  font-weight: 500;
                  line-height: 32px;
                  color: #9568ff;
                "
              >
                Withdrawal Receipt
              </p>
              <p style="font-size: 10px; font-weight: 400; line-height: 20px">
                Date: ${date}
              </p>
            </div>
  
            <div style="display: flex; justify-content: flex-start">
              <div>
                <p style="font-weight: 600; font-size: 14px; line-height: 20px">
                  ${name}
                </p>
                <p style="font-weight: 500; font-size: 14px; line-height: 20px">
                  <span
                    style="font-weight: 600; font-size: 12px; line-height: 20px"
                    >Email:</span
                  >
                  ${email}
                </p>
              </div>
            </div>
  
            <div style="display: flex; justify-content: space-between">
              <p style="font-weight: 700; font-size: 12px; line-height: 18px">
                Details
              </p>
              <p style="font-weight: 700; font-size: 12px; line-height: 18px">
                Amount
              </p>
            </div>
  
            <div style="display: flex; justify-content: space-between">
              <p style="font-weight: 400; font-size: 12px; line-height: 18px">
                Withdrawal Request Amount
              </p>
              <p style="font-weight: 400; font-size: 12px; line-height: 18px">
                ${amount}
              </p>
            </div>
  
            <div style="border: 1px solid #d5cee680"></div>
  
            <div style="display: flex; justify-content: right; margin-top: 30px">
              <div style="background: #e2dcf0; padding: 10px">
                <p
                  style="
                    padding: 0;
                    margin: 0;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 18px;
                  "
                >
                  TOTAL AMOUNT
                  <span
                    style="
                      margin-left: 30px;
                      font-weight: 500;
                      font-weight: 12px;
                      line-height: 18px;
                    "
                    >${amount}</span
                  >
                </p>
              </div>
            </div>
  
            <div style="margin: 15px 0px">
              <div>
                <p
                  style="
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 32px;
                    margin: 0;
                    padding: 0;
                  "
                >
                  Invoice Remarks
                </p>
              </div>
  
              <div>
                <p
                  style="
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 22px;
                    margin: 0;
                    padding: 0;
                  "
                >
                  Your withdrawal request will be processed to your nominated whitelisted bank account. If you have not authorised this withdrawal, please contact our support team immediately.
                </p>
              </div>
            </div>
          </div>
  
          <div
            style="
              background: #9568ff;
              color: #ffffff;
              height: 35px;
              text-align: center;
              margin-bottom: 15px;
            "
          >
            <p
              style="
                font-size: 10px;
                font-weight: 400;
                color: #ffffff;
                padding: 10px;
              "
            >
              © 2024 NebulaPayments. All rights reserved.
            </p>
          </div>
        </div>
  
        <div style="text-align: center; font-size: 14px; font-weight: 600">
          <p
            style="
              color: #9568ff;
              font-size: 14px;
              font-weight: 600;
              line-height: 22px;
            "
          >
            NebulaPayments
          </p>
        </div>
      </div>
    </body>
  </html>`;

const withdrawConfirmationTemplate = (
  Name,
  amount,
  subject,
  bsb,
  accountNumber
) => {
  const template = `
    <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We are pleased to inform you that your recent request to withdraw
      ${amount} from your Nebula account has been successfully
      processed. This email serves as your official confirmation for
      this transaction.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Transaction Details:
    </p>

    <ul>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        Withdrawal Amount: ${amount}
      </li>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        BSB: ${bsb}
      </li>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        ACC: ${accountNumber}
      </li>
    </ul>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We advise you to keep this information for your records. Should
      you encounter any issues or have any concerns regarding this
      transaction, please do not hesitate to contact our support team
      for assistance.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We look forward to continuing to serve your payment needs.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Transaction Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

const getCalendlyMeetUrl = (user, eddVerificationId) => {
  const site_url = urls.appUrl + "/schedule-meeting";
  const data = {
    email: user.contactEmail ? user.contactEmail : user.email,
    id: user.id,
    eddVerificationId: eddVerificationId,
    dateTime: moment().valueOf(),
  };
  const token = base64.encode(JSON.stringify(data));
  const url = `${site_url}/${token}`;
  return url;
};
const generatingWithdrawalReceiptPDF = async (
  name,
  date,
  amount,
  description,
  fileName,
  email,
  phone
) => {
  const template = WithDrawalReceiptTemplate(
    name,
    moment(date).format("DD MMM YYYY"),
    amount,
    description,
    email,
    phone
  );
  if (!fs.existsSync("public/receipts")) {
    if (!fs.existsSync("public")) fs.mkdirSync("public");
    fs.mkdirSync("public/receipts");
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(template);
  await page.pdf({
    path: "./public/receipts/" + fileName,
    printBackground: true,
  });
  await browser.close();
  const paths = path.join(
    // eslint-disable-next-line no-undef
    __dirname + "../../../" + `public/receipts/${fileName}`
  );

  return { filename: paths };
};

// const locationTemplate = (slot) => {
//   return `<p
//             style="
//                 font-family: 'Proxima Nova', 'proxima-nova',
//                     Helvetica, Arial sans-serif;
//                 margin-bottom: 12px;
//             "
//         >
//             <strong
//                 style="
//                     font-family: 'Proxima Nova', 'proxima-nova',
//                         Helvetica, Arial sans-serif;
//                     font-size: 14px;
//                 "
//             >
//                 Location:
//             </strong>
//             <br
//                 style="
//                     font-family: 'Proxima Nova', 'proxima-nova',
//                         Helvetica, Arial sans-serif;
//                 "
//             />
//             This is a Zoom web conference.
//         </p>
//         <div
//             style="
//                 font-family: 'Proxima Nova', 'proxima-nova',
//                     Helvetica, Arial sans-serif;
//                 padding-top: 5px;
//                 padding-bottom: 18px;
//             "
//         >
//             <p
//                 style="
//                     font-family: 'Proxima Nova', 'proxima-nova',
//                         Helvetica, Arial sans-serif;
//                     font-size: 86%;
//                 "
//             >
//                 <strong
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                     >Attendees can join this meeting from a
//                     computer, tablet or smartphone.</strong
//                 ><br
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                 />
//                 <a
//                     href="${slot.location.join_url}"
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                         color: rgb(0, 105, 255);
//                     "
//                     target="_blank"
//                     >${slot.location.join_url}</a
//                 ><br
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                 />
//                 <br
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                 /><strong
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                     >Password:</strong
//                 >
//                 ${slot.location.data.password}<br
//                     style="
//                         font-family: 'Proxima Nova',
//                             'proxima-nova', Helvetica,
//                             Arial sans-serif;
//                     "
//                 />
//             </p>
//         </div>`;
// };

const scheduleMeetingTemplate = (slot, subject) => {
  const template = `
  <div
  style="
    font-family: 'Proxima Nova', 'proxima-nova', Helvetica, Arial sans-serif;
    height: 100%;
    width: 100% !important;
  "
>
  <div
    style="
      font-family: 'Proxima Nova', 'proxima-nova', Helvetica, Arial sans-serif;
      max-width: 600px;
    "
  >
    <table
      style="
        font-family: 'Proxima Nova', 'proxima-nova', Helvetica, Arial sans-serif;
        width: 80%;
        font-size: 16px;
      "
    >
      <tbody>
        <tr
          style="
            font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
              Arial sans-serif;
          "
        >
          <td
            style="
              font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                Arial sans-serif;
              color: #1a1a1a;
              line-height: 22px;
            "
          >
            <p
              style="
                font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                  Arial sans-serif;
                margin-bottom: 12px;
              "
            >
              Hi,
            </p>

            <p
              style="
                font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                  Arial sans-serif;
                margin-bottom: 12px;
              "
            >
              A new event has been scheduled.
            </p>
            <p
              style="
                font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                  Arial sans-serif;
                margin-bottom: 12px;
              "
            >
              <strong
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                  font-size: 14px;
                "
              >
                Event Type:
              </strong>
              <br
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                "
              />
              ${slot.name}
            </p>
            <p
              style="
                font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                  Arial sans-serif;
                margin-bottom: 12px;
              "
            >
              <strong
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                  font-size: 14px;
                "
              >
                Start Date:
              </strong>
              <br
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                "
              />
              ${slot.end_time}
            </p>

            <p
              style="
                font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                  Arial sans-serif;
                margin-bottom: 12px;
              "
            >
              <strong
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                  font-size: 14px;
                "
              >
                End Date:
              </strong>
              <br
                style="
                  font-family: 'Proxima Nova', 'proxima-nova', Helvetica,
                    Arial sans-serif;
                "
              />
              ${slot.created_at}
            </p>

            ${
              slot.location && slot.location.data
                ? locationTemplate(slot)
                : null
            }
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;
  return EmailWrapper(template);
};

const depositOver10KConfirmationTemplate = (Name, subject) => {
  const template = `
  <div>Hi ${Name}div>
  <p>As part of implementing systems for ongoing customer due diligence purposes, Nebula Payments Pty Ltd would like to request further information regarding a recent deposit made through our online portal that has triggered an automatic EDD (enhanced due diligence) check for your account.</p>
  <p>We are required to verify KYC, whereby the following documents will be requested;</p>
  <ol>
  <li>Australian driver’s licence containing a photograph of the customer</li>
  <li>Australian passport</li>
  </ol>
  <div>You may also be asked to please provide the following information</div>
  <ul>
    <li>Source of the customer’s and each Beneficial Owner’s wealth, if sent from a business account (recent bank statements confirming ownership of funds)</li>
    <li>Please clarify the purpose, reasons for, or nature of these transactions</li>
    <li>The expected nature and level of transaction behaviour, including future transactions</li>
    <li>Please clarify the nature of the customer’s ongoing business with Nebula Payments Pty Ltd.</li>
  </ul>
  <div>A member of our Compliance Team will be in touch once you have selected a scheduled invite to go over these requirements via video conference.</div>
  <a href="https://calendly.com/nebula-payments">https://calendly.com/nebula-payments</a>
  <p>Please note that the video conference may take between 10-15 minutes and the request for the above mentioned identification documents will be required during the video call.
  </p>
  <div>This request must be provided in writing and notify the customer that if the request is not complied with, then Nebula Payments Pty Ltd may do any or all of the following until the information covered by the request is provided:</div>
  <ul>
    <li>restrict or limit the provision of the designated service to the customer.</li>
  </ul>`;
  return EmailWrapper(template);
};

const kycApprovedEmailTemplate = (Name, date) => {
  const template = `
  <h3 style="font-size: 18px; ">Dear ${Name}</h3> 
  <p>
  We are pleased to inform you that your KYC (Know Your Customer) verification process for your Nebula Trading account has been successfully completed as of ${date}. 
</p>
<p>Your account is now fully activated, and you can enjoy all the features and services available to our verified members. Thank you for taking the time to complete the necessary steps to secure and verify your account.</p>


<p>Should you have any questions or require further assistance, please feel free to contact our support team at ${contactSupport.email}. We are here to help!</p>
<p>Thank you for choosing Nebula. We look forward to continuing to serve you.
</p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        Nebula Compliance Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

const kycRejectedEmailTemplate = (Name) => {
  const template = `
<h3 style="font-size: 18px; ">Dear ${Name}</h3> 
<p>
  We regret to inform you that your KYC (Know Your Customer) verification for your Nebula Trading account has not been approved at this time.
</p>
<p>To complete your account verification, please follow the steps below:</p>

<ol>
<li>Gather the required documentation: [Gov ID, POA & Selfie with ID].</li>
<li>Ensure that all documents are clear and legible.</li>
<li>Resubmit your documents by sending an email to ${contactSupport.kycEmail} with the subject KYC Reverification.</li>
</ol>

<p>
  If you need assistance or have any questions about the required documents or the verification process, please do not hesitate to contact our support team at ${contactSupport.email}. We are here to help and ensure a smooth verification process.
</p>
<p>
  We appreciate your cooperation and look forward to assisting you in completing your KYC verification.
</p>
<p>
  Thank you for your attention to this matter.
</p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        Nebula Compliance Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

const withdrawCryptoConfirmationTemplate = (Name, amount, currency, txid) => {
  const template = `
    <p
      style="
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #9568ff;
      "
    >
      Dear ${Name},
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >

      We are pleased to inform you that your recent request to withdraw ${amount} ${currency} from your Nebula account has been successfully processed. This email serves as your official confirmation for this transaction.
    </p>

    <p
      style="
        font-size: 16px;
        font-weight: 500;
        line-height: 32px;
        color: #000000;
      "
    >
      Transaction Details:
    </p>

    <ul>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        Withdrawal Amount: ${amount} ${currency}
      </li>
      <li
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #374557;
        "
      >
        Transaction ID (TXID): ${txid}
      </li>
    </ul>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We advise you to keep this information for your records. Should you encounter any issues or have any concerns regarding this transaction, please do not hesitate to contact our support team for assistance.
    </p>

    <p
      style="
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #374557;
      "
    >
      We look forward to continuing to serve your payment needs.
    </p>

    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
        The Nebula Transaction Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

const resetBankEmailTemplate = (Name) => {
  const template = `
  <h3 style="font-size: 18px; ">Dear ${Name}</h3> 
  <p>
  We are writing to inform you that the withdrawal bank associated with your account has been successfully reset as per your request. This change has been processed and confirmed.
If you did not request this change or if you have any concerns regarding your account security, please contact our support team immediately at ${contactSupport.email}.

</p>
<p>Thank you for choosing Nebula. If you have any further questions or require assistance, please don't hesitate to reach out to us.</p>




    <div>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #374557;
          margin-bottom: 0px;
        "
      >
        Kind Regards,
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #9568ff;
          margin-top: 0px;
        "
      >
      Nebula Accounts Team
      </p>
    </div>
      `;
  return EmailWrapper(template);
};

module.exports = {
  Name,
  Subject,
  From,
  getFullName,
  UserAccountTemplate,
  ////////////
  IpChangedTemplate,
  ForgotPasswordTemplate,
  ResetPasswordTemplate,
  UserChangeEmailTemplate,
  UserChangeEmailNotificationTemplate,
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
  scheduleMeetingTemplate,
  depositOver10KConfirmationTemplate,
  kycFirstDepositEmailTemplate,
  kycApprovedEmailTemplate,
  kycRejectedEmailTemplate,
  withdrawCryptoConfirmationTemplate,
  resetBankEmailTemplate,
};
