const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

var userRouter = require('./routes/users');
app.use('/users', userRouter)

var todoRouter = require('./routes/todo');
app.use('/todo', todoRouter)

var taskRouter = require('./routes/task');
app.use('/task', taskRouter)


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});