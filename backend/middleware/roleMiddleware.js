// backend/middleware/roleMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (req.user.role !== "Staff") {
    return res.status(403).json({ error: "Access denied. Staff only." });
  }
  next();
};
