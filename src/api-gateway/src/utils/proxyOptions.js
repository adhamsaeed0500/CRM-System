const proxyReqPathResolver = (req) => req.originalUrl.split('/').slice(2).join('/');
const proxyErrorHandler = (err, res, next) => {
  console.error("Proxy Error:", err.message);
  res.status(500).json({ error: "Proxy failed", details: err.message });
};

module.exports = { proxyReqPathResolver, proxyErrorHandler };
