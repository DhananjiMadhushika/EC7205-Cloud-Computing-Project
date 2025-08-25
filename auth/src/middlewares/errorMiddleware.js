export function errorMiddleware(error, req, res, next) {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    errorCode: error.errorCode || "UNKNOWN",
    errors: error.errors || null,
  });
}
