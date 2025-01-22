import express from "express";

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  // Set default status code and message if not provided
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Additional error details for logging
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    statusCode: statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  // Log detailed error information in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error("Error Details:", JSON.stringify(errorDetails, null, 2));
  } else {
    // In production, log minimal error details or use a logging service
    console.error(`Error: ${message}, StatusCode: ${statusCode}`);
  }

  // Structure the error response
  const errorResponse = {
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  };

  // Return the error response
  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
