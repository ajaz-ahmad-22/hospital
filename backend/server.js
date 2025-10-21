// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import bodyParser from "body-parser";
// import os from "os";

// import db from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();
// const app = express();

// // ✅ Only allow from this computer
// const allowedIP = "192.168.100.5";
// const allowedMac = "04-68-74-5D-A4-2D";

// // ✅ Get current computer MAC address
// function getMacAddress() {
//   const networkInterfaces = os.networkInterfaces();
//   for (const iface of Object.values(networkInterfaces)) {
//     for (const details of iface) {
//       if (!details.internal && details.mac !== "00:00:00:00:00:00") {
//         return details.mac.replace(/:/g, "-").toUpperCase();
//       }
//     }
//   }
//   return null;
// }

// // ✅ Middleware: Restrict by IP + MAC
// app.use((req, res, next) => {
//   const clientIP =
//     req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
//   const currentMac = getMacAddress();
//   const normalizedIP = clientIP?.replace("::ffff:", "");

//   if (normalizedIP !== allowedIP) {
//     console.log(`❌ Unauthorized IP attempt: ${normalizedIP}`);
//     return res.status(403).json({ message: "Access denied: unauthorized IP" });
//   }

//   if (currentMac !== allowedMac) {
//     console.log(`❌ Unauthorized MAC attempt: ${currentMac}`);
//     return res
//       .status(403)
//       .json({ message: "Access denied: unauthorized computer" });
//   }

//   next();
// });

// // ✅ Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Routes
// app.use("/api/users", userRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/auth", authRoutes);

// // ✅ Test route
// app.get("/", (req, res) => {
//   res.send("🏥 Hospital Attendance API running securely on authorized system 🚀");
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




 import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hospital Attendance API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


