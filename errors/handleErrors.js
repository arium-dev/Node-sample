async function isJSON(str) {
  try {
    await JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function getMessage(msg) {
  let isJson = await isJSON(msg);
  if (isJson) return await JSON.parse(msg);
  return msg;
}

async function handleErrors(err, _, res, __) {
  console.log("err", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const message = err.message ? await getMessage(err.message) : "Unknown Error";

  if (err?.err) {
    //TODO: Generate Logs
  }

  res.status(err.statusCode).json({
    code: err.statusCode,
    message: message,
  });
}

module.exports = {
  handleErrors,
};
