const router = require("express").Router();
const userBudget = require("../models/userBudgetModel");
const auth = require("../middleware/auth");

router.post("/add", auth, async (req, res) => {
  try {
    const { category } = req.body;
    const { budget } = req.body;

    if (!category) return res.status(400).json({ msg: "Enter Category" });

    if (!budget) return res.status(400).json({ msg: "Enter Budget" });

    const addUserBudget = new userBudget({
      category,
      budget,
      userId: req.user,
    });

    const savedUserBudget = await addUserBudget.save();
    res.json(savedUserBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get", auth, async (req, res) => {
  const userBudgets = await userBudget.find({ userId: req.user });
  res.json(userBudgets);
});

module.exports = router;
