const router = require("express").Router();
const userExpense = require("../models/userExpenseModel");
const auth = require("../middleware/auth");

router.post("/add", auth, async (req, res) => {
  try {
    const { category } = req.body;
    const { expense } = req.body;
    const { month } = req.body;
    const { date } = req.body;

    if (!category) return res.status(400).json({ msg: "Enter Category" });

    if (!expense) return res.status(400).json({ msg: "Enter Expense" });

    if (!month) return res.status(400).json({ msg: "Enter Month" });

    const addUserExpense = new userExpense({
      category,
      expense,
      month,
      date,
      userId: req.user,
    });

    const savedUserExpense = await addUserExpense.save();
    res.json(savedUserExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get", auth, async (req, res) => {
  var monthData = req.query.month;
  if (!monthData) {
    monthData = "Jan";
  }
  const userExpenses = await userExpense.find({
    userId: req.user,
    month: monthData,
  });
  res.json(userExpenses);
});

module.exports = router;
