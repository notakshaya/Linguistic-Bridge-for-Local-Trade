import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Send, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  MessageSquare,
  Bot,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react'
import io from 'socket.io-client'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Negotiation() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [currentOffer, setCurrentOffer] = useState(null)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const messagesEndRef = useRef(null)

  const [offerForm, setOfferForm] = useState({
    amount: '',
    quantity: 1,
    notes: ''
  })

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    // Join negotiation room
    newSocket.emit('join-negotiation', {
      negotiationId: id,
      userId: user?.id,
      userType: user?.userType
    })

    // Listen for messages
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // Listen for offers
    newSocket.on('new-offer', (offer) => {
      setCurrentOffer(offer)
      toast.success('New offer received!')
    })

    return () => {
      newSocket.close()
    }
  }, [id, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return

    setIsTranslating(true)
    
    // Send message with translation
    socket.emit('send-message', {
      negotiationId: id,
      message: newMessage,
      originalLang: 'en', // Detect user's language
      targetLang: 'es' // Detect other party's language
    })

    setNewMessage('')
    setIsTranslating(false)
  }

  const makeOffer = () => {
    if (!socket || !offerForm.amount) return

    const offer = {
      amount: parseFloat(offerForm.amount),
      quantity: parseInt(offerForm.quantity),
      notes: offerForm.notes,
      timestamp: new Date()
    }

    socket.emit('make-offer', {
      negotiationId: id,
      offer
    })

    setOfferForm({ amount: '', quantity: 1, notes: '' })
    toast.success('Offer sent!')
  }

  const acceptOffer = () => {
    toast.success('Offer accepted! Trade completed.')
  }

  const rejectOffer = () => {
    toast.error('Offer rejected.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Live <span className="gradient-text">Negotiation</span>
          </h1>
          <p className="text-xl text-slate-600">
            Real-time translation and AI-powered negotiation assistance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card h-96 flex flex-col"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">AH</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Ahmed Hassan</h3>
                    <p className="text-sm text-slate-600">Spice Merchant • Online</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="badge badge-success">
                    <Globe className="w-3 h-3 mr-1" />
                    Auto-translate: ON
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === user?.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.translated || message.original}</p>
                      {message.original !== message.translated && (
                        <p className="text-xs opacity-75 mt-1 italic">
                          Original: "{message.original}"
                        </p>
                      )}
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 input"
                    disabled={isTranslating}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isTranslating || !newMessage.trim()}
                    className="btn-primary px-4"
                  >
                    {isTranslating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Offer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Offer</h3>
              
              {currentOffer ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-semibold text-slate-900">${currentOffer.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-semibold text-slate-900">{currentOffer.quantity} lbs</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={acceptOffer}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={rejectOffer}
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 btn text-sm py-2"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No active offer</p>
              )}
            </motion.div>

            {/* Make Offer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Make an Offer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price per lb
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={offerForm.amount}
                      onChange={(e) => setOfferForm({ ...offerForm, amount: e.target.value })}
                      className="input pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quantity (lbs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={offerForm.quantity}
                    onChange={(e) => setOfferForm({ ...offerForm, quantity: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={offerForm.notes}
                    onChange={(e) => setOfferForm({ ...offerForm, notes: e.target.value })}
                    className="input h-20 resize-none"
                    placeholder="Add any special requirements..."
                  />
                </div>

                <button
                  onClick={makeOffer}
                  disabled={!offerForm.amount}
                  className="w-full btn-primary"
                >
                  Send Offer
                </button>
              </div>
            </motion.div>

            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-800">
                    💡 Market price for premium saffron is $15-18/gram. Your offer of $16/gram is competitive.
                  </p>
                </div>
                
                <div className="p-3 bg-accent-50 rounded-lg">
                  <p className="text-sm text-accent-800">
                    🌍 Cultural tip: In Middle Eastern markets, building rapport before discussing price is valued.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    📈 Suggested response: "Your saffron quality looks excellent. Can we discuss bulk pricing?"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}