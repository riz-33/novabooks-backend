import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

export const createTransaction = async (req, res) => {
  try {
    const { description, date, journalLines } = req.body;

    // 1️⃣ Create transaction object
    const transaction = new Transaction({
      description,
      date,
      journalLines,
      userId: req.user.id,
    });

    // 2️⃣ Save transaction (this validates double-entry)
    await transaction.save();

    // 3️⃣ Update account balances
    for (const line of journalLines) {
      const account = await Account.findById(line.accountId);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const amount = line.amount;

      if (line.type === "Debit") {
        if (account.type === "Asset" || account.type === "Expense") {
          account.balance += amount;
        } else {
          account.balance -= amount;
        }
      }

      if (line.type === "Credit") {
        if (account.type === "Asset" || account.type === "Expense") {
          account.balance -= amount;
        } else {
          account.balance += amount;
        }
      }

      await account.save();
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
