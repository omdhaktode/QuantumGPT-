// Creating routes here
import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIApiResponse from '../utils/openai.js'

const router = express.Router();

router.post("/test",async (req,res) => {
    try {
        const thread = new Thread({
            threadID : "234",
            title : "Testing API Endpoint"
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "Failed to save in database "})
    }
})

// get all threads
router.get("/thread", async (req,res) => {
    try {
        const thread = await Thread.find({}).sort({updatedAt : -1});
        res.json(thread);

    } catch (error) {
        console.log(err);
        res.status(500).json({message : "Failed to fetch threads"})
    }
});

//get specific chat
router.get("/thread/:threadID", async (req,res) => {
    const {threadID} = req.params;
    try {
        const thread =  await Thread.findOne({threadID});
        if(!thread) {
            res.status(404).json({message : "Not found"});
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Failed to fetch chat"})
    }
} )

// delete chat
router.delete("/thread/:threadID", async(req,res) => {
    const {threadID} = req.params;
    try {
        const thread = await Thread.findOneAndDelete({threadID});
        if(!thread) {
            res.status(404).json({message : "Chat not found"})
        }    
        res.status(200).json({message : "Successfully Deleted"})
    } catch {
        console.log(error);
        res.status(500).json({message : "Failed to delete chat"})
    }
});

// new chat route
router.post("/chat", async (req,res) => {
    const { threadID, message } = req.body;
    if(!threadID || !message ) {
        res.status(400).json({message : "Missing required feilds"})
    }
    try {
        let thread = await Thread.findOne({threadID});
        if(!thread) {
            // creating new chat in DB
            thread = new Thread({
                threadID,
                title : message,
                messages :[{
                    role: "user",
                    content : message
                }] 
            });
        } else {
            thread.messages.push({role : "user", content : message});
        }
        const assistantReply =await  getOpenAIApiResponse(message);
        thread.messages.push({role :"assistant", content : assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply : assistantReply});
    } catch (error) {
     console.log(error);
     res.status(500).json({message : "Failed to create new chat"})    
 }
});
export default router;