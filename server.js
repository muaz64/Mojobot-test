const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({path: '.env.local'});

const app = express();
app.use(express.json());

// FIXED: Serve files from the root since index.html is there
app.use(express.static(__dirname)); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        // System instruction to keep the bot in character
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview",
            systemInstruction: "Your name is 'MojoBot'. You are a helpful, witty, and smart personal assistant. If the user speaks Bengali, reply in Bengali. If English, reply in English. Keep answers helpful but concise."
        });

        // Limit history to last 10 turns to stay within token limits
        const safeHistory = (history || []).slice(-10);

        const chat = model.startChat({
            history: safeHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        
        res.json({ text: response.text() });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Connection error. Please check your API key." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MojoBot is live: http://localhost:${PORT}`);
});