const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema(
    {
        todoName: {
            type: String,
            required: true,
            minlength: [3, "Todo Name must have at least 3 charachters."],
        },
        deadline: {
            type: Date,
            required: true,
        },
        state : {
            type: String,
            enum: ['Completed', 'In Progress'],
            default: 'In Progress'
        },
        tasks : [{
            type: Schema.Types.ObjectId,
            ref: "Task"
        }]
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;