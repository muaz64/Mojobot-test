const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // MojoBot-এর ব্যক্তিত্ব সেট করা হলো
            systemInstruction: "Your name is 'MojoBot'. You are a smart and friendly personal assistant. You must respond in the language the user uses (Bengali or English). Always be helpful, witty, and concise."
        });

        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "MojoBot is having some trouble connecting. Try again!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MojoBot is live on http://localhost:${PORT}`));