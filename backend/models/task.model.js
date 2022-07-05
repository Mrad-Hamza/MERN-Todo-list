const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        taskname: {
            type: String,
            required: true,
            minlength: [3, "Todo Name Minimum 3 charachters."],
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Low'
        },
        startDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;