const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://linguatrade.vercel.app",
      "https://linguatrade.netlify.app",
      /\.vercel\.app$/,
      /\.netlify\.app$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://linguatrade.vercel.app",
    "https://linguatrade.netlify.app",
    /\.vercel\.app$/,
    /\.netlify\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/negotiations', require('./routes/negotiations'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/pricing', require('./routes/pricing'));

// Socket.IO for real-time features
const activeNegotiations = new Map();
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-negotiation', (data) => {
    const { negotiationId, userId, userType } = data;
    socket.join(negotiationId);
    
    if (!activeNegotiations.has(negotiationId)) {
      activeNegotiations.set(negotiationId, {
        participants: [],
        messages: [],
        currentOffer: null
      });
    }
    
    const negotiation = activeNegotiations.get(negotiationId);
    negotiation.participants.push({ userId, userType, socketId: socket.id });
    
    connectedUsers.set(socket.id, { userId, negotiationId });
    
    socket.to(negotiationId).emit('user-joined', { userId, userType });
  });

  socket.on('send-message', async (data) => {
    const { negotiationId, message, originalLang, targetLang } = data;
    
    // Simulate AI translation (replace with actual AI service)
    const translatedMessage = await translateMessage(message, originalLang, targetLang);
    
    const messageData = {
      id: Date.now(),
      original: message,
      translated: translatedMessage,
      timestamp: new Date(),
      sender: connectedUsers.get(socket.id)?.userId
    };
    
    if (activeNegotiations.has(negotiationId)) {
      activeNegotiations.get(negotiationId).messages.push(messageData);
    }
    
    io.to(negotiationId).emit('new-message', messageData);
  });

  socket.on('make-offer', (data) => {
    const { negotiationId, offer } = data;
    
    if (activeNegotiations.has(negotiationId)) {
      activeNegotiations.get(negotiationId).currentOffer = {
        ...offer,
        timestamp: new Date(),
        sender: connectedUsers.get(socket.id)?.userId
      };
    }
    
    socket.to(negotiationId).emit('new-offer', offer);
  });

  socket.on('disconnect', () => {
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      socket.to(userData.negotiationId).emit('user-left', userData.userId);
      connectedUsers.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Mock translation function (replace with actual AI service)
async function translateMessage(text, fromLang, toLang) {
  // This would integrate with Google Translate, OpenAI, or similar service
  const translations = {
    'en-es': {
      'Hello': 'Hola',
      'How much?': '¿Cuánto cuesta?',
      'Good price': 'Buen precio'
    },
    'es-en': {
      'Hola': 'Hello',
      '¿Cuánto cuesta?': 'How much?',
      'Buen precio': 'Good price'
    }
  };
  
  return translations[`${fromLang}-${toLang}`]?.[text] || `[Translated: ${text}]`;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 LinguaTrade server running on port ${PORT}`);
});