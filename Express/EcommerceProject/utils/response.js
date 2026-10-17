const sendErrResponse = (res, err) => {
  let statusCode = err.statusCode;
  let message = err.message;

  console.log("send Error response function called");
  return res.status(statusCode).json({
    message: message,
    status: false,
  });
};

module.exports = sendErrResponse;
