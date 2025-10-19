export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  
  // Check if it's a custom error with statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ 
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined
  });
};