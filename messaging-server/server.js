const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins, or specify your frontend URL
    methods: ['GET', 'POST']
  }
});

const supabaseUrl = 'https://lgqwtpmygjpbbdieaqof.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncXd0cG15Z2pwYmJkaWVhcW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODQsImV4cCI6MjAzMjIyOTk4NH0.WWAJO34PkmGTNXVSfsl0VXnv7xnJOv9Gbg2DDcNf5FU";
const supabase = createClient(supabaseUrl, supabaseKey);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const channel = supabase
  .from('messages')
  .on('*', (payload) => {
    console.log('Change received!', payload);
    io.emit('newMessage', payload.new);
  })
  .subscribe();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));