export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Only log real server errors — 4xx are the client's fault, not ours.
  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({ success: false, message });
};
