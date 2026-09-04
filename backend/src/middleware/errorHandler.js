export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  console.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}`)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Anomaly Detected.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}
