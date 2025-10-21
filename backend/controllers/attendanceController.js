import db from "../config/db.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

// ------------------------ CHECK-IN ------------------------
export const checkIn = (req, res) => {
  const staff_id = req.user.staff_id;
  db.query(
    "SELECT id FROM attendance WHERE staff_id = ? AND check_out IS NULL ORDER BY id DESC LIMIT 1",
    [staff_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length > 0)
        return res.status(400).json({ error: "Already checked in" });

      db.query(
        "INSERT INTO attendance (staff_id, check_in) VALUES (?, NOW())",
        [staff_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          return res.json({ message: "Checked in successfully" });
        }
      );
    }
  );
};

// ------------------------ CHECK-OUT ------------------------
export const checkOut = (req, res) => {
  const staff_id = req.user.staff_id;
  db.query(
    "SELECT id FROM attendance WHERE staff_id = ? AND check_out IS NULL ORDER BY id DESC LIMIT 1",
    [staff_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(400).json({ error: "No active check-in found" });

      db.query(
        "UPDATE attendance SET check_out = NOW() WHERE id = ?",
        [rows[0].id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          return res.json({ message: "Checked out successfully" });
        }
      );
    }
  );
};

// ------------------------ STATUS ------------------------
export const getStatus = (req, res) => {
  const staff_id = req.user.staff_id;
  db.query(
    "SELECT check_in, check_out FROM attendance WHERE staff_id = ? ORDER BY id DESC LIMIT 1",
    [staff_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.json({ checkedIn: false, current: null });

      const current = rows[0];
      res.json({ checkedIn: current.check_out === null, current });
    }
  );
};

// ------------------------ GET USER ATTENDANCE (ADMIN) ------------------------
export const getUserAttendance = (req, res) => {
  const { staff_id } = req.params;
  const { from, to } = req.query;

  let query = "SELECT check_in, check_out FROM attendance WHERE staff_id = ?";
  const params = [staff_id];

  if (from && to) {
    query += " AND DATE(check_in) BETWEEN ? AND ?";
    params.push(from, to);
  }

  query += " ORDER BY id ASC";

  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// ------------------------ EXPORT PDF ------------------------
export const exportAttendancePDF = (req, res) => {
  const { staff_id } = req.params;
  const { from, to } = req.query;

  let query = "SELECT check_in, check_out FROM attendance WHERE staff_id = ?";
  const params = [staff_id];

  if (from && to) {
    query += " AND DATE(check_in) BETWEEN ? AND ?";
    params.push(from, to);
  }

  query += " ORDER BY id ASC";

  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Disposition", `attachment; filename=attendance_${staff_id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.fontSize(16).text("🏥 Hospital Attendance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Staff ID: ${staff_id}`);
    if (from && to) doc.text(`Date Range: ${from} to ${to}`);
    doc.moveDown();

    doc.fontSize(12).text("Check In".padEnd(30) + "Check Out");
    doc.moveDown(0.5);

    rows.forEach((row) => {
      const checkIn = row.check_in ? new Date(row.check_in).toLocaleString() : "-";
      const checkOut = row.check_out ? new Date(row.check_out).toLocaleString() : "-";
      doc.text(`${checkIn.padEnd(30)}${checkOut}`);
    });

    doc.end();
    doc.pipe(res);
  });
};

// ------------------------ EXPORT EXCEL ------------------------
export const exportAttendanceExcel = async (req, res) => {
  const { staff_id } = req.params;
  const { from, to } = req.query;

  let query = "SELECT check_in, check_out FROM attendance WHERE staff_id = ?";
  const params = [staff_id];

  if (from && to) {
    query += " AND DATE(check_in) BETWEEN ? AND ?";
    params.push(from, to);
  }

  query += " ORDER BY id ASC";

  db.query(query, params, async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Check In", key: "check_in", width: 30 },
      { header: "Check Out", key: "check_out", width: 30 },
    ];

    rows.forEach((r) => {
      sheet.addRow({
        check_in: r.check_in ? new Date(r.check_in).toLocaleString() : "-",
        check_out: r.check_out ? new Date(r.check_out).toLocaleString() : "-",
      });
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance_${staff_id}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

//------------------------ADD EXPORT FOR ALL STAFF FOR ADMIN------------------------
// Admin: full attendance history for all staff with optional date filter
export const getAllAttendance = (req, res) => {
  let { startDate, endDate } = req.query;

  let query = "SELECT staff_id, check_in, check_out FROM attendance";
  const params = [];

  if (startDate && endDate) {
    query += " WHERE check_in BETWEEN ? AND ?";
    params.push(startDate + " 00:00:00", endDate + " 23:59:59");
  }

  query += " ORDER BY check_in ASC";

  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
