import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute.js";
import accountRoutes from "./routes/accountRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
// import reportRoutes from './routes/reportRoute.js'
// import budgetRoutes from './routes/budgetRoute.js'

const app = express();

connectDB().catch((err) => console.error("Initial connection failed:", err));

// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "http://localhost:5000",
//         "https://fintrack-frontend-nine.vercel.app"
//     ],
//     credentials: true
// }));

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// app.use("/api/reports", reportRoutes);
// app.use("/api/budgets", budgetRoutes);

app.get("/", (req, res) => res.send("API is running"));

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
}

export default app;
