const mongoose = require("mongoose");
const userBudgetModel = require("./models/userBudgetModel");
const userModel = require("./models/userModel");
const userExpenseModel = require("./models/userExpenseModel");
require("dotenv").config();
const userData = {
  email: "bharadwajtirunagaru14@gmail.com",
  password: "12345678",
  displayName: "Bharadwaj",
};
let user_id = "";
describe("UserModel, UserBudgetModel and UserExpenseModel: MongoDB Models Test", () => {
  //connecting to the MongoDB Memory Server using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING,
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  it("Create and Save User Test", async () => {
    const createUser = new userModel(userData);
    const savedCreatedUser = await createUser.save();
    user_id = savedCreatedUser._id;
    expect(savedCreatedUser._id).toBeDefined();
    expect(savedCreatedUser.email).toBe(userData.email);
  });

  it("Add UserBudget Test", async () => {
    userBudgetData = { category: "Net Bill", budget: 50, userId: user_id };
    const budget = new userBudgetModel(userBudgetData);
    const addedBudget = await budget.save();
    expect(addedBudget._id).toBeDefined();
    expect(addedBudget.category).toBe(userBudgetData.category);
    expect(addedBudget.budget).toBe(userBudgetData.budget);
  });

  it("Add UserExpense Test", async () => {
    userExpenseData = {
      category: "Net Bill",
      expense: 40,
      month: "Jan",
      date: new Date(),
      userId: user_id,
    };
    const expense = new userExpenseModel(userExpenseData);
    const addedExpense = await expense.save();
    expect(addedExpense._id).toBeDefined();
    expect(addedExpense.category).toBe(userExpenseData.category);
    expect(addedExpense.expense).toBe(userExpenseData.expense);
  });
});
