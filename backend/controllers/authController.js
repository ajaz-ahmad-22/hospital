import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = (req, res) => {
  const { staff_id, password } = req.body;
  if (!staff_id || !password) return res.status(400).json({ error: "Staff ID and password required" });

  db.query("SELECT * FROM users WHERE staff_id=?", [staff_id], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    if (user.status !== "Active") return res.status(403).json({ error: "User is disabled" });

    // Create token with role info
    const token = jwt.sign(
      { id: user.id, staff_id: user.staff_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name
    });
  });
};
