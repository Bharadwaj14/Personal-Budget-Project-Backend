const mongoose = require("mongoose");
const userExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  expense: { type: Number, required: true },
  month: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
});

userExpenseSchema.index({ category: 1, month: 1 }, { unique: true });

module.exports = UserExpense = mongoose.model(
  "user_expense",
  userExpenseSchema
);
