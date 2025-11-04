import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import fs from "fs";

import { connectDB } from "./lib/db.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" })); // allows to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "frontend/dist")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend/dist/index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  // Проверка дали frontend/dist съществува
  const frontendPath = path.join(__dirname, "frontend/dist");

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get("/*", (req, res) => {
      res.sendFile(path.resolve(frontendPath, "index.html"));
    });
  } else {
    console.log("Frontend build not found, serving API only");
  }
}

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
