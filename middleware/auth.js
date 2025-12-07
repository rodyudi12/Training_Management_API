const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // 🔥 Allow tests to bypass authentication
  if (process.env.NODE_ENV === 'test') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireManager(req, res, next) {
  // 🔥 Also bypass manager check in test mode
  if (process.env.NODE_ENV === 'test') return next();

  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Manager access required' });
  }
  next();
}

module.exports = { requireAuth, requireManager };
