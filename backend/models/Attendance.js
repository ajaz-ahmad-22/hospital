// backend/models/Attendance.js
import db from "../config/db.js";

// Create Attendance table if it doesn't exist
const createAttendanceTableQuery = `
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    date DATE NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES users(staff_id)
)
`;

db.query(createAttendanceTableQuery, (err) => {
    if (err) {
        console.error("❌ Error creating attendance table:", err.message);
    } else {
        console.log("✅ Attendance table ready");
    }
});

export default db;
