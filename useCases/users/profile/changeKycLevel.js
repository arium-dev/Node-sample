const Errors = require("../../../errors");
const { HttpStatusCode, GenericMessages } = require("../../../constants");

async function changeKycLevel({ id, level }, { userRepository }) {
  try {
    let user = await userRepository.findById(id);
    if (!user) {
      throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
    }
    user.level = level;
    user = await userRepository.save(user);
    return {
      code: HttpStatusCode.OK,
      user: user.toProfile(),
    };
  } catch (err) {
    throw new Errors.InternalServerError(GenericMessages.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { changeKycLevel };
