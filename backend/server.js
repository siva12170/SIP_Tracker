import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import investorRoutes from "./routes/investor.routes.js";
import fundRoutes from "./routes/fund.routes.js";
import sipRoutes from "./routes/sip.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import verifyToken from "./middleware/auth.middleware.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/investors", verifyToken, investorRoutes);
app.use("/api/funds", verifyToken, fundRoutes);
app.use("/api/sips", verifyToken, sipRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("SIP Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
