const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios= require('axios');
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());



const getprompt =(gameType,category)=>{
    const prefix = category!=='random' ? `Category: ${category}.`:'';

    if (gameType === 'would-you-rather') {
    return `${prefix}Generate 3 'Would You Rather' questions. Focus on interesting and moderately challenging dilemmas. Do not provide answers. Format each question as 'Would you rather [option 1] or [option 2]?'`;
  } else {
    return `${prefix}Generate 3 sets of 'Two Truths and a Lie' statements. Each set should consist of 3 concise sentences. Mark the lie with (L).`;
  }
}


app.post('/api/questions',async(req,res)=>{

    const {gameType,category}=req.body;

    const prompt = getprompt(gameType,category);

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-70b-8192", // You can also try llama3-8b-8192 for lighter use
      messages: [
        { role: "system", content: "You are a creative party game assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

        const aiResponse = response.data.choices[0].message.content;
    const questions = aiResponse.split(/\n+/).filter(line => line.trim());
        // console.log(questions);
        if (questions.length === 0) {
            return res.status(400).json({error: 'No questions generated. Please try again.'});
        }

        res.status(200).json({questions: questions});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred while generating questions.'});
    }
})


app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});




setInterval(() => {
  axios.get('https://notedown-project.onrender.com/healthcheck')
    .then(response => {
      console.log('Ping successful:', response.data);
    })
    .catch(error => {
      console.error('Ping failed:', error.message);
    });
}, 5 * 60 * 1000); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));