const express = require("express");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const taskRouter = require("./routers/task");
const app = express();
const appRouter = express.Router();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/", appRouter);

appRouter.use("/", authRouter);
appRouter.use("/", profileRouter);
appRouter.use("/", taskRouter);

// app.get('/',(req,res)=>{

//     res.json({message:"hello world"})

// })
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully ");
    app.listen(PORT, () => {
      console.log("server started running at " + `${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));

app.use((err, req, res, next) => {
  res.status(400).json({ message: "something went wrong" + err.message });
});
