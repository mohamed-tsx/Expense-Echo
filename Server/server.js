const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
