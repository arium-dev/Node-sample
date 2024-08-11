const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,

  UserMessages,
} = require("../../../constants");

const {
  userDepositWallet,
  userBalanceLookup,
} = require("../../../utils/searches");
const { nameAddField } = require("../../../utils/addFields");
const { userWalletProject } = require("../../../utils/projects");

async function getUsersWithWallets({ userRepository }) {
  const pipeline = [
    ...userDepositWallet,
    ...userBalanceLookup,
    nameAddField,
    userWalletProject,
  ];
  const users = await userRepository.findByAggregation(pipeline);
  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USERS_FETCHED_SUCCESS,
    data: users,
  };
}

module.exports = { getUsersWithWallets };
