const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

exports.staffOnly = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ message: "Staff only" });
  }
  next();
};
