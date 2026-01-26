const express = require('express');
const router = express.Router();

// Mock market data
const marketData = {
  'organic-tomatoes': {
    averagePrice: 3.75,
    priceRange: { min: 2.50, max: 5.00 },
    trend: 'rising',
    seasonalFactor: 1.2,
    demandLevel: 'high'
  },
  'fresh-avocados': {
    averagePrice: 2.25,
    priceRange: { min: 1.50, max: 3.00 },
    trend: 'stable',
    seasonalFactor: 0.9,
    demandLevel: 'medium'
  },
  'saffron-premium': {
    averagePrice: 18.00,
    priceRange: { min: 12.00, max: 25.00 },
    trend: 'volatile',
    seasonalFactor: 1.0,
    demandLevel: 'low'
  }
};

// Get AI price discovery
router.post('/discover', (req, res) => {
  const { productName, quantity, location, vendorId } = req.body;
  
  const productKey = productName.toLowerCase().replace(/\s+/g, '-');
  const market = marketData[productKey] || generateDefaultMarketData();
  
  const aiAnalysis = {
    suggestedPrice: calculateOptimalPrice(market, quantity, location),
    marketAnalysis: {
      averagePrice: market.averagePrice,
      priceRange: market.priceRange,
      trend: market.trend,
      confidence: 0.87
    },
    factors: [
      {
        name: 'Seasonal Demand',
        impact: market.seasonalFactor > 1 ? 'positive' : 'negative',
        weight: Math.abs(market.seasonalFactor - 1) * 100
      },
      {
        name: 'Local Competition',
        impact: 'moderate',
        weight: 15
      },
      {
        name: 'Quality Premium',
        impact: 'positive',
        weight: 10
      }
    ],
    negotiationRange: {
      floor: Math.round(market.priceRange.min * 100) / 100,
      ceiling: Math.round(market.priceRange.max * 100) / 100,
      target: Math.round(market.averagePrice * 100) / 100
    },
    recommendations: generatePricingRecommendations(market, quantity)
  };
  
  res.json(aiAnalysis);
});

// Get market trends
router.get('/trends/:category', (req, res) => {
  const { category } = req.params;
  const { timeframe = '7d' } = req.query;
  
  const trends = generateMarketTrends(category, timeframe);
  
  res.json(trends);
});

// Get competitive analysis
router.post('/competitive-analysis', (req, res) => {
  const { productName, location, radius = 5 } = req.body;
  
  const analysis = {
    competitors: [
      {
        vendorName: 'Green Valley Market',
        distance: 0.8,
        price: 3.25,
        rating: 4.6,
        availability: 'in-stock'
      },
      {
        vendorName: 'Fresh Corner',
        distance: 1.2,
        price: 3.90,
        rating: 4.3,
        availability: 'limited'
      },
      {
        vendorName: 'Organic Plus',
        distance: 2.1,
        price: 4.15,
        rating: 4.8,
        availability: 'in-stock'
      }
    ],
    pricePosition: 'competitive',
    marketShare: 'medium',
    recommendations: [
      'Your price is within the competitive range',
      'Consider highlighting organic certification',
      'Bulk discounts could attract larger orders'
    ]
  };
  
  res.json(analysis);
});

// Real-time price updates
router.get('/realtime/:productId', (req, res) => {
  const { productId } = req.params;
  
  // Simulate real-time price fluctuations
  const basePrice = 3.50;
  const fluctuation = (Math.random() - 0.5) * 0.20; // ±10 cents
  const currentPrice = Math.round((basePrice + fluctuation) * 100) / 100;
  
  const update = {
    productId,
    currentPrice,
    change: fluctuation,
    changePercent: Math.round((fluctuation / basePrice) * 10000) / 100,
    timestamp: new Date(),
    volume: Math.floor(Math.random() * 100) + 50,
    alerts: generatePriceAlerts(currentPrice, basePrice)
  };
  
  res.json(update);
});

function calculateOptimalPrice(market, quantity, location) {
  let price = market.averagePrice;
  
  // Quantity discount
  if (quantity > 10) {
    price *= 0.95;
  } else if (quantity > 5) {
    price *= 0.98;
  }
  
  // Seasonal adjustment
  price *= market.seasonalFactor;
  
  // Location premium (simulate)
  if (location && location.includes('downtown')) {
    price *= 1.1;
  }
  
  return Math.round(price * 100) / 100;
}

function generateDefaultMarketData() {
  return {
    averagePrice: 5.00,
    priceRange: { min: 3.00, max: 8.00 },
    trend: 'stable',
    seasonalFactor: 1.0,
    demandLevel: 'medium'
  };
}

function generatePricingRecommendations(market, quantity) {
  const recommendations = [];
  
  if (market.trend === 'rising') {
    recommendations.push('Market prices are trending up - consider pricing at the higher end');
  }
  
  if (quantity > 10) {
    recommendations.push('Large quantity order - offer bulk discount to secure sale');
  }
  
  if (market.demandLevel === 'high') {
    recommendations.push('High demand period - premium pricing justified');
  }
  
  return recommendations;
}

function generateMarketTrends(category, timeframe) {
  // Mock trend data
  const dataPoints = [];
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      price: 3.50 + (Math.random() - 0.5) * 0.5,
      volume: Math.floor(Math.random() * 200) + 100
    });
  }
  
  return {
    category,
    timeframe,
    data: dataPoints,
    summary: {
      averagePrice: 3.50,
      priceChange: '+2.3%',
      volumeChange: '+15.7%',
      volatility: 'low'
    }
  };
}

function generatePriceAlerts(currentPrice, basePrice) {
  const alerts = [];
  
  if (Math.abs(currentPrice - basePrice) > 0.15) {
    alerts.push({
      type: 'price_movement',
      message: `Significant price movement detected: ${currentPrice > basePrice ? '+' : ''}${((currentPrice - basePrice) / basePrice * 100).toFixed(1)}%`
    });
  }
  
  return alerts;
}

module.exports = router;