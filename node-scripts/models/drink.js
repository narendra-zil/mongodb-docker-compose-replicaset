const mongoose = require("mongoose");

const drink = new mongoose.Schema(
    {
        name: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

exports.drinkSchema =  mongoose.model("Drink", drink);