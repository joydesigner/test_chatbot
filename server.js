const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const llmService = require('./llm');

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // send welcome message
    socket.emit('chat response', 'Hello! I am the AI assistant. How can I help you today?');

    socket.on('chat message', async (message) => {
        try {
            // emit 'thinking' message
            socket.emit('thinking', true);

            const response = await llmService.getResponse(message);
            console.log('Assistant Response:', response);

            // emit 'thinking' message as false
            socket.emit('thinking', false);

            // emit 'chat response' message
            socket.emit('chat response', response);
        } catch (error) {
            console.error('Error:', error.message);
            socket.emit('chat response', 'Sorry, something went wrong.');
        }
    });

    socket.on('reset conversation', () => {
        llmService.resetConversation();
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});