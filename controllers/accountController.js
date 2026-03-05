import Account from "../models/Account.js";

// Create Account
export const createAccount = async (req, res) => {
  try {
    const { name, type } = req.body;

    const account = await Account.create({
      userId: req.user.id,
      name,
      type,
    });

    res.status(201).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
