const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const userRoutes = require("./Routes/UserRoutes");
const { errorMiddleWare } = require("./MiddleWares/errorMiddleWare");
const expenseRoutes = require("./Routes/expenseRoutes.js");
PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/users", userRoutes);
app.use("/expense", expenseRoutes);

//Handling the errors and returning them as json
app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
