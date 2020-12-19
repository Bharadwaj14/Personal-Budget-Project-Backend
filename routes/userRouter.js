const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Please enter all the fields." });
    if (password.length < 8)
      return res.status(400).json({
        msg: "The password should be minimum 8 characters in length.",
      });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Re-enter password again for registering." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "User already exists with the same email." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields." });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "User account does not exit with this email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Please enter valid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, { expiresIn: "60s" });
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.password);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: User.displayName,
    id: User._id,
  });
});

module.exports = router;
