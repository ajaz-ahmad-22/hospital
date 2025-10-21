// backend/models/User.js
import db from "../config/db.js";

// Create Users table if it doesn't exist
const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    staff_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin','Staff') NOT NULL DEFAULT 'Staff',
    status ENUM('Active','Disabled') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createUserTableQuery, (err) => {
    if (err) {
        console.error("❌ Error creating users table:", err.message);
    } else {
        console.log("✅ Users table ready");
    }
});

export default db;
