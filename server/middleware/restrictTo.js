export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // C2 admin hierarchy
    if (req.user.role === 'admin') {
      return next();
    }

    // C3 multiple roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission',
      });
    }

    next();
  };
};
