const flattenSubmittedBy = {
  $unwind: {
    path: "$submittedBy",
    preserveNullAndEmptyArrays: true,
  },
};

const flattenRole = {
  $unwind: {
    path: "$submittedBy.role",
    preserveNullAndEmptyArrays: true,
  },
};
module.exports = {
  flattenSubmittedBy,
  flattenRole,
};
