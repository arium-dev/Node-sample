const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,
  Roles,
  RoleMessages,
  OffsetLimit,
  UserMessages,
} = require("../../../constants");
const { getPaginationWithTotalCountFacet } = require("../../../utils/facet");
const {
  userDepositWallet,
  userPreferenceLookup,
  userWalletSearch,
  rootUserSearch,
  currencySearch,
  kycSearch,
  userWithdrawWallet,
} = require("../../../utils/searches");
const { nameAddField } = require("../../../utils/addFields");
const { userProject } = require("../../../utils/projects");

const DefaultCurrency = "AUD";

async function getAllUsers(
  query,
  { userRepository, roleRepository, currencyRepository }
) {
  const role = await roleRepository.findOne({ name: Roles.USER });
  if (!role) {
    throw new Errors.NotFound(RoleMessages.NOT_FOUND);
  }

  const { page, offset, searched } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  let condition = {
    $match: {
      $and: [
        ...(searched
          ? [
              {
                $or: [
                  ...userWalletSearch(searched),
                  ...rootUserSearch(searched),
                  ...currencySearch(searched),
                  ...kycSearch(searched),
                ],
              },
            ]
          : []),

        { roleId: new ObjectId(role.id) },
      ],
    },
  };

  const facet = getPaginationWithTotalCountFacet({ pageLimit, limit });
  const pipeline = [
    ...userDepositWallet,
    ...userWithdrawWallet,
    ...userPreferenceLookup,
    nameAddField,
    condition,
    userProject,
    facet,
  ];

  const users = await userRepository.findByAggregation(pipeline);
  const currency = await currencyRepository.findOne({
    code: DefaultCurrency,
  });

  let list = users?.[0]?.paginatedData || [];
  if (list?.length > 0 && currency) {
    delete currency.conversionRate;
    delete currency.symbol;

    list = list.map((recipient) => ({ ...recipient, currency: currency }));
  }
  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USERS_FETCHED_SUCCESS,
    data: {
      list: list,
      count: users?.[0]?.totalCount?.[0]?.count || 0,
    },
  };
}

module.exports = { getAllUsers };
