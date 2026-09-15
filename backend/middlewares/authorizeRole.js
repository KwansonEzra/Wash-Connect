import asyncHandler from './asyncHandler.js';

const authorizeRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user object');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden: Role '${req.user.role}' is not allowed access`);
    }

    next();
  });
};

export default authorizeRole;