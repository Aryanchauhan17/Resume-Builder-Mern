const mongoose = require("mongoose");

//define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}); 

//export the user model in other files 
module.exports = mongoose.model("User", userSchema);