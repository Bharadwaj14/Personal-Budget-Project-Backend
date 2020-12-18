const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server started on port:${PORT}`));

mongoose.connect(
  "mongodb+srv://project-users:mlabuncc@project-cluster.okbih.mongodb.net/personal-budget?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Successfully connected to personal-budget MongoDB database");
  }
);

app.use(express.static('./client/build'));

app.use("/users", require("./routes/userRouter"));
app.use("/budget", require("./routes/userBudgetRouter"));
app.use("/expense", require("./routes/userExpenseRouter"));
