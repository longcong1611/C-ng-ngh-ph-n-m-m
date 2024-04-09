const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");



connect.then(() => {
    console.log("Database connected Successfully");
})

.catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email:{
        type: String,
        require: true,
    },
    Password:  {
        type: String,
        required: true,
    },
    logins: [{
        type: Date
    }]
}, { timestamps: true });

//collection Part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;

