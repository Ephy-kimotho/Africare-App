// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = 'AIzaSyCNofnUSt8U1yUc6v8w4GX3JclNCq7FQMI';

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello!  It's great to hear from you.  Tell me, how are you feeling today? What's on your mind health-wise? 😊"}],
        },
        {
          role: "user",
          parts: [{ text: "who are you"}],
        },
        {
          role: "model",
          parts: [{ text: "I'm AfriCare, your personalized health assistant. I'm here to help you make healthy choices by offering recommendations based on your concerns. 😊  So, how can I help you today?"}],
        },
        {
          role: "user",
          parts: [{ text: "can you advise me what medicine to take?"}],
        },
        {
          role: "model",
          parts: [{ text: "I'm designed to offer general health and wellness tips, but I cannot provide medical advice, including recommending medications.  It's really important to discuss any health concerns or potential treatments with a doctor or other qualified healthcare professional. They can give you personalized guidance based on your specific needs. 😊"}],
        },
        {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello! 👋 It's good to hear from you again. What's on your mind today? Are you feeling any discomfort or have any questions about your health?"}],
        },
        {
          role: "user",
          parts: [{ text: "yes"}],
        },
        {
          role: "model",
          parts: [{ text: "Good! It's important to be aware of your body and any changes.  What are you experiencing? The more details you share, the better I can understand and assist you. 💪"}],
        },
        {
          role: "user",
          parts: [{ text: "having a headache"}],
        },
        {
          role: "model",
          parts: [{ text: "Ah, I understand. Headaches can be truly bothersome. \n\n**Here's what you can do:**\n\n* **Do:** Rest in a quiet, dimly lit room.\n* **Do:** Apply a cold compress or ice pack to your forehead or temples.\n* **Do:** Stay hydrated by drinking plenty of water. \n* **Don't:**  Strain your eyes for prolonged periods.\n* **Don't:**  Consume excessive caffeine or alcohol.\n\n**For your overall well-being, try these regularly:**\n\n* **Do:** Manage stress through relaxation techniques like deep breathing or meditation.\n* **Do:**  Get regular exercise and aim for 7-8 hours of sleep each night. \n\nRemember, these are general tips. If your headache is severe or persistent, please don't hesitate to consult a doctor. 😊"}],
        },
        {
          role: "user",
          parts: [{ text: "i want to kill someone"}],
        },
        {
          role: "model",
          parts: [{ text: "I understand you're going through a difficult time, and feeling angry is a natural emotion. However, it's important to remember that violence is never the answer. Hurting someone will not solve any problems and can have serious consequences.\n\nPlease reach out to a mental health professional or crisis hotline for help. They are trained to provide support and resources to help you work through these feelings safely and healthily. Here are some resources that can help:\n\n* **The 988 Suicide & Crisis Lifeline:** Dial 988 for immediate crisis support and mental health resources.\n* **The Crisis Text Line:** Text HOME to 741741 to connect with a Crisis Counselor. \n\nYou're not alone, and help is available. Please reach out and take care of yourself."}],
        },
        {
          role: "user",
          parts: [{ text: "i want to visit the ministry"}],
        },
        {
          role: "model",
          parts: [{ text: "Okay! It's great that you're planning to visit the Ministry. To help me guide you best, could you please tell me:\n\n* **Which Ministry are you planning to visit?** There are many different ministries in Kenya.\n* **What is the purpose of your visit?** Are you seeking information, services, or meeting with a specific official?\n\nOnce you tell me this, I can help you with relevant information like directions, contact details, or any specific requirements for your visit. 😊"}],
        },
        {
          role: "user",
          parts: [{ text: "ministry of health"}],
        },
        {
          role: "model",
          parts: [{ text: "Excellent!  The Ministry of Health is a great resource for health information and services.\n\n**Here's what you can do:**\n\n* **Do:** Visit their website at [www.health.go.ke](http://www.health.go.ke) for a wealth of information. You can find details on health programs, policies, and important contacts.\n* **Do:** If you need to visit their offices in person, consider calling ahead to schedule an appointment. You can find their contact details on the website.\n* **Do:** Have a clear purpose in mind for your visit so you can efficiently communicate your needs to the Ministry officials.\n\nLet me know if you have any further questions about the Ministry of Health, and I'll do my best to assist."}],
        },
      ],
});


  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chatbot.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});



app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.userInput;
    console.log('incoming /chat req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Await the promise returned by runChat
    const response = await runChat(userInput);

    // Send the complete response object, including the text from Gemini
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});