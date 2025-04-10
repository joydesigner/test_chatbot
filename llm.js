const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

class LLMService {
    constructor() {
        this.apiKey = API_KEY;
        this.apiUrl = API_URL;
    }

    async getResponse(message) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error querying AI:', error.response ? error.response.data : error.message);
            throw new Error('Failed to get response from LLM');
        }
    }
}

module.exports = new LLMService(); 