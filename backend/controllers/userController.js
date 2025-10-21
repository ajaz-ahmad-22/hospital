// backend/controllers/userController.js
import db from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users with last check-in/out
export const getUsers = (req, res) => {
  db.query(
    `SELECT u.id, u.name, u.staff_id, u.role, u.status,
            MAX(a.check_in) AS last_check_in,
            MAX(a.check_out) AS last_check_out
     FROM users u
     LEFT JOIN attendance a ON u.staff_id = a.staff_id
     GROUP BY u.id, u.name, u.staff_id, u.role, u.status
     ORDER BY u.id ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Add user (Admin only)
export const addUser = async (req, res) => {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).json({ error: "Admin only" });

  const { name, staff_id, password, role } = req.body;
  if (!name || !staff_id || !password || !role)
    return res.status(400).json({ error: "All fields required" });

  // Check if staff_id already exists
  db.query("SELECT * FROM users WHERE staff_id=?", [staff_id], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0) return res.status(400).json({ error: "Staff ID already exists" });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, staff_id, password, role, status) VALUES (?, ?, ?, ?, 'Active')",
      [name, staff_id, hashed, role],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "User added successfully" });
      }
    );
  });
};

// Toggle user status
export const toggleStatus = (req, res) => {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).json({ error: "Admin only" });

  const { staff_id } = req.params;
  const { status } = req.body;

  db.query("UPDATE users SET status=? WHERE staff_id=?", [status, staff_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status updated" });
  });
};

// Delete user
export const deleteUser = (req, res) => {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).json({ error: "Admin only" });

  const { staff_id } = req.params;
  db.query("DELETE FROM users WHERE staff_id=?", [staff_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted" });
  });
};
