const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to db");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use("/", mainRouter);
// app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(err.statusCode).send({ message: err.message });
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
