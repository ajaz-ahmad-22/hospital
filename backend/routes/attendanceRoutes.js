import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  checkIn,
  checkOut,
  getStatus,
  getUserAttendance,
  exportAttendancePDF,
  exportAttendanceExcel,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Staff routes
router.post("/checkin", verifyToken, checkIn);
router.post("/checkout", verifyToken, checkOut);
router.get("/status", verifyToken, getStatus);

// Admin routes
router.get("/history/:staff_id", verifyToken, isAdmin, getUserAttendance);
router.get("/export/pdf/:staff_id", verifyToken, isAdmin, exportAttendancePDF);
router.get("/export/excel/:staff_id", verifyToken, isAdmin, exportAttendanceExcel);

export default router;
