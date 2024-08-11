const messages = {
  forgetPassword: {
    type: "profile",
    message: "Submitted a request to reset the password.",
  },
  resetPassword: {
    type: "profile",
    message: "Reset account password.",
  },
  verifiedAccount: {
    type: "profile",
    message: "Account verified successfully.",
  },
  changePassword: {
    type: "profile",
    message: "Password change successfully.",
  },
  updateProfile: {
    type: "profile",
    message: "Update profile information.",
    message: "Profile information updated successfully.",
  },
  AcceptTerms: {
    type: "profile",
    message: "Terms & conditions accepted successfully.",
  },
  AddContactEmail: {
    type: "profile",
    message: "Add contact email.",
  },
  changeEmailRequest: {
    type: "emailChangeRequest",
    message: "Email change request sent.",
  },
  changeEmail: {
    type: "emailChange",
    message: "Email changed successfully.",
  },
  resendEmail: {
    type: "resendEmail",
    message: "Resend email sent successfully.",
  },
};
const getMessage = (type) => {
  return messages[type]
    ? messages[type]
    : {
        type: "profile",
        message: "Update profile information.",
      };
};

// const getBalanceLogMessage = (data, type = "debited") => {
//   if (data.type === "npp") {
//     ("Balance updated by Webhook");
//   } else
//     return `Balance ${type} for ${data.side} asset ${data?.currency?.toUpperCase()} coin!`;
// };

// const getCryptoBalanceLogMessage = (data) => {
//   return `Crypto balance ${
//     data.side === "buy"
//       ? "credited"
//       : data.side === "withdraw" || data.side === "sell"
//         ? "debited"
//         : ""
//   } for ${data.side} asset of ${data.currency} coin`;
// };

// const getCustomTradeMessage = (trade, add = "") => {
//   return {
//     type: trade.side,
//     message: `You requested to ${
//       trade.side
//     } Asset ${trade?.currency?.toUpperCase()} coin worth ${
//       trade.side === "buy" ? "A$" + trade.amount : trade.quantity
//     } ${
//       trade.side === "withdraw" || trade.side === "sell"
//         ? trade.currency.toUpperCase()
//         : ""
//     } ${add ? add : ""}`,
//   };
// };

// const getCustomTradeMessageByAdmin = (trade, status = "", user) => {
//   const operation = `${
//     trade.side
//   } ${trade.currency.toUpperCase()} coin worth A$${trade.amount} ${status}`;
//   const message = `${user?.firstName} ${user?.lastName} request to ${operation} by Admin!`;
//   return message;
// };

// const getTradeNotes = (user) => {
//   return `NP-${user.firstName}${user.lastName ? "-" + user.lastName : ""}`;
// };

module.exports = {
  getMessage,
  // getBalanceLogMessage,
  // getCryptoBalanceLogMessage,
  // getCustomTradeMessage,
  // getTradeNotes,
  // getCustomTradeMessageByAdmin,
};
