const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/tripphuot1");

connect.then(() => {   console.log("Database connected Successfully");
})

.catch(() => {
    console.log("Database cannot be connected");
});

const TripSchema = new mongoose.Schema({
    Destination: {
        type: String,
        required: true,
    },
    Time: {
        type: String,
        required: true,
    },
    Description:{
        tyoe: String,
    },
    Contact: {
        Tyoe: String,
        required: true,
    }
});

const collection = new mongoose.model("trip", TripSchema);

module.exports = collection;

