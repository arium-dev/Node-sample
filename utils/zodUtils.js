const { z } = require("zod");
const dbId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a 24-byte hexadecimal number");

module.exports = { dbId };
