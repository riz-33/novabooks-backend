import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTransaction,
  //   getTransactions,
  //   updateTransaction,
  //   deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.user.id,
  }).populate("journalLines.accountId");

  res.json(transactions);
});

// router.get("/", authMiddleware, getTransactions);
// router.put("/:id", authMiddleware, updateTransaction);
// router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
