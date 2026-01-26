const express = require('express');
const router = express.Router();

// Mock translation service (replace with actual AI service)
const translations = {
  'en-es': {
    'Hello': 'Hola',
    'How much does this cost?': '¿Cuánto cuesta esto?',
    'Can you give me a better price?': '¿Puedes darme un mejor precio?',
    'I\'ll take it': 'Me lo llevo',
    'Thank you': 'Gracias',
    'Good quality': 'Buena calidad',
    'Fresh produce': 'Productos frescos',
    'What\'s your best price?': '¿Cuál es tu mejor precio?',
    'I need': 'Necesito',
    'pounds': 'libras',
    'kilograms': 'kilogramos'
  },
  'es-en': {
    'Hola': 'Hello',
    '¿Cuánto cuesta esto?': 'How much does this cost?',
    '¿Puedes darme un mejor precio?': 'Can you give me a better price?',
    'Me lo llevo': 'I\'ll take it',
    'Gracias': 'Thank you',
    'Buena calidad': 'Good quality',
    'Productos frescos': 'Fresh produce',
    '¿Cuál es tu mejor precio?': 'What\'s your best price?',
    'Necesito': 'I need',
    'libras': 'pounds',
    'kilogramos': 'kilograms'
  },
  'en-ar': {
    'Hello': 'مرحبا',
    'How much does this cost?': 'كم يكلف هذا؟',
    'Thank you': 'شكرا لك',
    'Good quality': 'جودة جيدة'
  },
  'ar-en': {
    'مرحبا': 'Hello',
    'كم يكلف هذا؟': 'How much does this cost?',
    'شكرا لك': 'Thank you',
    'جودة جيدة': 'Good quality'
  }
};

// Translate text
router.post('/', async (req, res) => {
  const { text, fromLang, toLang, context } = req.body;
  
  try {
    // Simulate AI translation with context awareness
    const translationKey = `${fromLang}-${toLang}`;
    let translatedText = translations[translationKey]?.[text];
    
    if (!translatedText) {
      // Fallback to mock translation
      translatedText = await mockAITranslation(text, fromLang, toLang, context);
    }
    
    const response = {
      originalText: text,
      translatedText,
      fromLanguage: fromLang,
      toLanguage: toLang,
      confidence: 0.95,
      alternatives: generateAlternatives(translatedText, toLang),
      culturalNotes: getCulturalNotes(text, fromLang, toLang)
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
  ];
  
  res.json(languages);
});

// Get common phrases for trading
router.get('/phrases/:category', (req, res) => {
  const { category } = req.params;
  const { lang = 'en' } = req.query;
  
  const phrases = {
    greetings: [
      { en: 'Hello, how are you?', es: 'Hola, ¿cómo estás?', ar: 'مرحبا، كيف حالك؟' },
      { en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' },
      { en: 'Nice to meet you', es: 'Mucho gusto', ar: 'تشرفنا بلقائك' }
    ],
    pricing: [
      { en: 'How much is this?', es: '¿Cuánto cuesta esto?', ar: 'كم سعر هذا؟' },
      { en: 'Can you give me a discount?', es: '¿Puedes hacerme un descuento?', ar: 'هل يمكنك إعطائي خصم؟' },
      { en: 'What\'s your best price?', es: '¿Cuál es tu mejor precio?', ar: 'ما هو أفضل سعر لديك؟' }
    ],
    quality: [
      { en: 'This looks fresh', es: 'Esto se ve fresco', ar: 'هذا يبدو طازجاً' },
      { en: 'Is this organic?', es: '¿Es orgánico?', ar: 'هل هذا عضوي؟' },
      { en: 'Good quality', es: 'Buena calidad', ar: 'جودة جيدة' }
    ]
  };
  
  res.json(phrases[category] || []);
});

async function mockAITranslation(text, fromLang, toLang, context) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Context-aware translation simulation
  if (context === 'negotiation' && text.includes('price')) {
    return `[AI: Price-focused translation] ${text}`;
  }
  
  if (context === 'greeting') {
    return `[AI: Polite greeting] ${text}`;
  }
  
  return `[AI Translated from ${fromLang} to ${toLang}]: ${text}`;
}

function generateAlternatives(translatedText, toLang) {
  // Generate alternative translations
  return [
    `${translatedText} (formal)`,
    `${translatedText} (casual)`,
    `${translatedText} (business)`
  ];
}

function getCulturalNotes(text, fromLang, toLang) {
  const notes = {
    'en-es': [
      'In Spanish-speaking markets, building personal rapport is important before discussing business',
      'Use "usted" for formal situations, "tú" for casual interactions'
    ],
    'en-ar': [
      'Greeting and asking about family is customary before business discussions',
      'Bargaining is expected and part of the cultural experience'
    ]
  };
  
  return notes[`${fromLang}-${toLang}`] || [];
}

module.exports = router;