import mongoose from "mongoose";

const journalLineSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["Debit", "Credit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    journalLines: {
      type: [journalLineSchema],
      validate: {
        validator: function (lines) {
          const totalDebit = lines
            .filter((l) => l.type === "Debit")
            .reduce((sum, l) => sum + l.amount, 0);

          const totalCredit = lines
            .filter((l) => l.type === "Credit")
            .reduce((sum, l) => sum + l.amount, 0);

          return totalDebit === totalCredit;
        },
        message: "Total Debit must equal Total Credit",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);