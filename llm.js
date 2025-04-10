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
        this.conversationHistory = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];
    }

    async getResponse(message) {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({ role: 'user', content: message });

            const response = await axios.post(
                this.apiUrl,
                {
                    model: MODEL,
                    messages: this.conversationHistory,
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

            const assistantResponse = response.data.choices[0].message.content;
            console.log('Assistant Response:', assistantResponse);

            // Add assistant response to conversation history
            this.conversationHistory.push({ role: 'assistant', content: assistantResponse });

            return assistantResponse;
        } catch (error) {
            console.error('Error querying AI:', error.response ? error.response.data : error.message);
            throw new Error('Failed to get response from LLM');
        }
    }

    // Method to reset conversation history
    resetConversation() {
        this.conversationHistory = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];
    }
}

module.exports = new LLMService(); 