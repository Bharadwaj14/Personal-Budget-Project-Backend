const mongoose = require("mongoose");
const userBudgetSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  budget: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = UserBudget = mongoose.model("user_budget", userBudgetSchema);
