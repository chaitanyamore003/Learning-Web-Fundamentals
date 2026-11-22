// AppError: an Error with an HTTP status code attached.
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// asyncHandler: wraps an async route so thrown errors reach errorHandler
// instead of becoming an unhandled promise rejection.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // Show the first issue only — clean single-message error.
    const message = result.error.issues[0]?.message || "Invalid input";
    return next(new AppError(message, 400));
  }
  req.body = result.data; // ← transforms (.trim, .toLowerCase) applied
  next();
};
