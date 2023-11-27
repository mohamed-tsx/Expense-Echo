const errorMiddleWare = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Check if the client accepts JSON
  const contentType = req.get("Content-Type");
  if (contentType === "application/json" || req.accepts("json")) {
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  } else {
    // If the client doesn't accept JSON, send a plain text response
    res.send(`Error: ${err.message}`);
  }
};

module.exports = {
  errorMiddleWare,
};
