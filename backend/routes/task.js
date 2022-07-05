var express = require('express');
const jwt = require("jsonwebtoken");
let Task = require("../models/task.model");
const passport = require("passport");
const router = express.Router();
require('../config/passport')

router.route("/addTask").post((req, res) => {
    const taskname = req.body.taskname;
    let priority = req.body.priority;
    if (!priority) {
        priority = "Low";
    }
    const startDate = Date();
    const task = new Task({ taskname, priority, startDate });
    task
        .save()
        .then(() => res.json("Task added!"))
        .catch((err) => {
            console.log(err)
            res.status(400).json("Error: " + err)
        });
})



router.route("/").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Task.find().populate("Todo")
        .then((tasks) => res.json(tasks))
})

router.route("/:id").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Task.findById(req.params.id).populate("Todo")
        .then((task) => res.json(task))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(() => res.json("Task deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;