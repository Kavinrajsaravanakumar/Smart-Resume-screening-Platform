function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack || err.message);

  const statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || 'Server Internal Error',
  });
}

module.exports = errorHandler;
