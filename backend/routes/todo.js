var express = require('express');
const jwt = require("jsonwebtoken");
let Todo = require("../models/todo.model");
let Task = require("../models/task.model");
const passport = require("passport");
const router = express.Router();
require('../config/passport')

router.route("/addTodo").post((req, res) => {
    const todoName = req.body.todoName;
    const deadline = req.body.deadline;
    var state = req.body.state;
    if (!state) {
        state = "In Progress";
    }
    const tasks = [];

    const todo = new Todo({ todoName, deadline, state, tasks });
    todo
        .save()
        .then(() => res.json("todo added!"))
        .catch((err) => {
            console.log(err)
            res.status(400).json("Error: " + err)
        });
})



router.route("/").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Todo.find().populate("tasks")
        .then((todos) => res.json(todos))
})

router.route("/:id").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Todo.findById(req.params.id).populate("tasks")
        .then((todo) => res.json(todo))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then(() => res.json("Todo deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:idTodo/:idTask").put((req, res) => {
    Todo.findByIdAndUpdate(req.params.idTodo)
        .then((todo) => {
            // user.firstname = req.body.body.username;
            // user.lastname = req.body.body.lastname;
            // user.mailAddress = req.body.body.mailAddress;
            // user.phone = req.body.body.phone;
            todo.tasks.push(req.params.idTask)
            todo.save()
                .then(() => res.json("Todo updated!"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;