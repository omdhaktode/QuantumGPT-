import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/api",chatRoutes);

app.listen(port, () => {
    console.log("Let's build QuantamGPT...");
    connectDB();
})

// Connect to our database
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)     
    .then(() => {
        console.log("Database Connected")
    }).catch((err) => {
        console.log(err)
    })
}

// //app.post('/test',async (req,res) => {
//     const options = {
//         method : "POST",
//         headers : {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body : JSON.stringify({
//             model : "gpt-4o-mini",
//             messages : [{
//                 role : "user",
//                 content : req.body.message
//             }]
//         })
//     };
//     try {
//        const response = await fetch("https://api.openai.com/v1/chat/completions",options);
//        const data = await response.json();
//        res.send(data.choices[0].message.content); 
//     } catch (error) {
//         console.log(error)
//     }
// // })

app.get('/',(req,res) => {
    res.send("Hello QuantamGPT")
})