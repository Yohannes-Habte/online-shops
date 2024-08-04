// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  // Log error details in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
