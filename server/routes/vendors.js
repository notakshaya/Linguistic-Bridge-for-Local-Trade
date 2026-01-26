const express = require('express');
const router = express.Router();

// Mock vendor database
const vendors = new Map([
  ['1', {
    id: '1',
    name: 'Maria\'s Fresh Produce',
    owner: 'Maria Rodriguez',
    category: 'fruits-vegetables',
    languages: ['es', 'en'],
    location: { lat: 40.7128, lng: -74.0060, address: 'Lower East Side, NYC' },
    products: [
      { id: '1', name: 'Organic Tomatoes', basePrice: 3.50, unit: 'lb', inStock: true },
      { id: '2', name: 'Fresh Avocados', basePrice: 2.00, unit: 'each', inStock: true },
      { id: '3', name: 'Bell Peppers', basePrice: 4.00, unit: 'lb', inStock: true }
    ],
    rating: 4.8,
    totalSales: 1250,
    isOnline: true,
    negotiationStyle: 'flexible'
  }],
  ['2', {
    id: '2',
    name: 'Ahmed\'s Spice Corner',
    owner: 'Ahmed Hassan',
    category: 'spices-herbs',
    languages: ['ar', 'en', 'fr'],
    location: { lat: 40.7589, lng: -73.9851, address: 'Midtown, NYC' },
    products: [
      { id: '4', name: 'Saffron Premium', basePrice: 15.00, unit: 'gram', inStock: true },
      { id: '5', name: 'Cardamom Pods', basePrice: 8.50, unit: 'oz', inStock: true },
      { id: '6', name: 'Turmeric Powder', basePrice: 3.25, unit: 'oz', inStock: true }
    ],
    rating: 4.9,
    totalSales: 890,
    isOnline: true,
    negotiationStyle: 'traditional'
  }]
]);

// Get all vendors
router.get('/', (req, res) => {
  const { category, location, language } = req.query;
  let filteredVendors = Array.from(vendors.values());
  
  if (category) {
    filteredVendors = filteredVendors.filter(v => v.category === category);
  }
  
  if (language) {
    filteredVendors = filteredVendors.filter(v => v.languages.includes(language));
  }
  
  res.json(filteredVendors);
});

// Get vendor by ID
router.get('/:id', (req, res) => {
  const vendor = vendors.get(req.params.id);
  
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  
  res.json(vendor);
});

// Search vendors
router.post('/search', (req, res) => {
  const { query, filters } = req.body;
  let results = Array.from(vendors.values());
  
  if (query) {
    results = results.filter(v => 
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.products.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
    );
  }
  
  if (filters?.category) {
    results = results.filter(v => v.category === filters.category);
  }
  
  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    results = results.filter(v => 
      v.products.some(p => p.basePrice >= min && p.basePrice <= max)
    );
  }
  
  res.json(results);
});

// Update vendor status
router.patch('/:id/status', (req, res) => {
  const { isOnline } = req.body;
  const vendor = vendors.get(req.params.id);
  
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  
  vendor.isOnline = isOnline;
  vendors.set(req.params.id, vendor);
  
  res.json({ success: true, vendor });
});

module.exports = router;