const express = require('express');
const router = express.Router();

// Mock negotiations database
const negotiations = new Map();

// Create new negotiation
router.post('/', (req, res) => {
  const { vendorId, buyerId, productId, initialOffer } = req.body;
  
  const negotiationId = Date.now().toString();
  const negotiation = {
    id: negotiationId,
    vendorId,
    buyerId,
    productId,
    status: 'active', // active, completed, cancelled
    offers: [
      {
        id: '1',
        amount: initialOffer.amount,
        quantity: initialOffer.quantity,
        sender: buyerId,
        timestamp: new Date(),
        status: 'pending'
      }
    ],
    messages: [],
    createdAt: new Date(),
    aiSuggestions: generateAISuggestions(initialOffer)
  };
  
  negotiations.set(negotiationId, negotiation);
  
  res.json({ success: true, negotiation });
});

// Get negotiation by ID
router.get('/:id', (req, res) => {
  const negotiation = negotiations.get(req.params.id);
  
  if (!negotiation) {
    return res.status(404).json({ error: 'Negotiation not found' });
  }
  
  res.json(negotiation);
});

// Add offer to negotiation
router.post('/:id/offers', (req, res) => {
  const { amount, quantity, senderId } = req.body;
  const negotiation = negotiations.get(req.params.id);
  
  if (!negotiation) {
    return res.status(404).json({ error: 'Negotiation not found' });
  }
  
  const offer = {
    id: Date.now().toString(),
    amount,
    quantity,
    sender: senderId,
    timestamp: new Date(),
    status: 'pending'
  };
  
  negotiation.offers.push(offer);
  negotiation.aiSuggestions = generateAISuggestions({ amount, quantity });
  
  negotiations.set(req.params.id, negotiation);
  
  res.json({ success: true, offer, aiSuggestions: negotiation.aiSuggestions });
});

// Accept/reject offer
router.patch('/:id/offers/:offerId', (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  const negotiation = negotiations.get(req.params.id);
  
  if (!negotiation) {
    return res.status(404).json({ error: 'Negotiation not found' });
  }
  
  const offer = negotiation.offers.find(o => o.id === req.params.offerId);
  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  
  offer.status = status;
  
  if (status === 'accepted') {
    negotiation.status = 'completed';
    negotiation.finalPrice = offer.amount;
    negotiation.finalQuantity = offer.quantity;
  }
  
  negotiations.set(req.params.id, negotiation);
  
  res.json({ success: true, negotiation });
});

// Get AI pricing suggestions
router.get('/:id/ai-suggestions', (req, res) => {
  const negotiation = negotiations.get(req.params.id);
  
  if (!negotiation) {
    return res.status(404).json({ error: 'Negotiation not found' });
  }
  
  const suggestions = generateAdvancedAISuggestions(negotiation);
  
  res.json(suggestions);
});

function generateAISuggestions(offer) {
  const basePrice = offer.amount;
  
  return {
    priceRange: {
      min: Math.round((basePrice * 0.85) * 100) / 100,
      max: Math.round((basePrice * 1.15) * 100) / 100,
      optimal: Math.round((basePrice * 0.95) * 100) / 100
    },
    marketAnalysis: {
      trend: 'stable',
      demandLevel: 'medium',
      seasonalFactor: 1.0
    },
    negotiationTips: [
      'Consider bulk pricing for larger quantities',
      'Mention repeat business potential',
      'Highlight product quality requirements'
    ]
  };
}

function generateAdvancedAISuggestions(negotiation) {
  const lastOffer = negotiation.offers[negotiation.offers.length - 1];
  
  return {
    recommendedResponse: {
      action: 'counter_offer',
      amount: Math.round((lastOffer.amount * 0.92) * 100) / 100,
      reasoning: 'Based on market analysis and negotiation patterns'
    },
    culturalInsights: [
      'In this market, gradual price reductions are expected',
      'Building rapport before discussing price is valued',
      'Quality emphasis can justify higher prices'
    ],
    languageHelp: {
      keyPhrases: [
        { en: 'What\'s your best price?', es: '¿Cuál es tu mejor precio?' },
        { en: 'Can we work something out?', es: '¿Podemos llegar a un acuerdo?' }
      ]
    }
  };
}

module.exports = router;