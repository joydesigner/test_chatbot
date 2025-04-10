const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const SYSTEM_PROMPT = 'You are an expert in the field of AI and machine learning. You are also a helpful assistant that can answer questions and help with tasks.';

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
                    model: MODEL,
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
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