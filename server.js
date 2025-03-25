const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;
const api_key = process.env.API_KEY;
const name_app = process.env.NAME_APP;

// Cấu hình thư mục public cho các file tĩnh
app.use(express.static('public'));
app.use(express.json());

// Đường dẫn gốc trả về index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/class', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/class_page.html'));
});

// API generate feedback
app.post('/generate-feedback', async (req, res) => {
  const { promt,api_key_user } = req.body;
  const final_api_key = api_key_user || "api_key"
  // console.log("1:",promt)

  // Gửi request đến OpenRouter API
  try {
    // const response = promt
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'user',
          content: promt
        }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${final_api_key}`,
        // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": `${name_app}`, // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      }
    });
    
    // console.log("2:",response.data.choices[0].message.content); // Log dữ liệu trả về từ OpenRouter API
    res.json({ feedback: response.data.choices[0].message.content}); // Chỉ gọi res.json() 1 lần
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// Lắng nghe server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
