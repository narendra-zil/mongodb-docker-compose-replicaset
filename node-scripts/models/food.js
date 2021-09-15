const mongoose = require("mongoose");

const food = new mongoose.Schema(
    {
        name: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);


exports.foodSchema = mongoose.model("Food", food);