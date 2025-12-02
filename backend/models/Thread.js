import mongoose from 'mongoose';

// Creating schema of Message 
const MessageSchema = new mongoose.Schema({
    role : {
        type : String,
        enum : ["user","assistant"],
        required : true
    },
    content : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
});

// Creating schema of Chat Thread
const ThreadSchema = new mongoose.Schema({
    threadID : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        default : "New Chat"
    },
    messages : [MessageSchema],
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})

const Thread = mongoose.model("Thread",ThreadSchema);

export default Thread; 
