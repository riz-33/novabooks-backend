import express from "express";

import {
  createAccount,
  getAccounts,
//   editAccount,
//   deleteAccount,
} from "../controllers/accountController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAccount);
router.get("/", authMiddleware, getAccounts);
// router.put("/:id", authMiddleware, editAccount);
// router.delete("/:id", authMiddleware, deleteAccount);

export default router;
