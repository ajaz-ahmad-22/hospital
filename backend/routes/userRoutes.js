import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  getUsers,
  addUser,
  toggleStatus,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.use(verifyToken); // All routes protected by token
router.get("/", isAdmin, getUsers);
router.post("/", isAdmin, addUser);
router.put("/status/:staff_id", isAdmin, toggleStatus);
router.delete("/:staff_id", isAdmin, deleteUser);

export default router;
