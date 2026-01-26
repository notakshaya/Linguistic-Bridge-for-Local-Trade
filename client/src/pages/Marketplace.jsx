import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  MessageCircle, 
  TrendingUp,
  Globe,
  Clock,
  Users
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Marketplace() {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪' },
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', icon: '🥕' },
    { id: 'spices-herbs', name: 'Spices & Herbs', icon: '🌿' },
    { id: 'dairy-eggs', name: 'Dairy & Eggs', icon: '🥛' },
    { id: 'meat-seafood', name: 'Meat & Seafood', icon: '🐟' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'crafts', name: 'Handmade Crafts', icon: '🎨' }
  ]

  const languages = [
    { code: 'all', name: 'All Languages' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'zh', name: 'Chinese' }
  ]

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    filterVendors()
  }, [vendors, searchQuery, selectedCategory, selectedLanguage])

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/api/vendors')
      setVendors(response.data)
      setIsLoading(false)
    } catch (error) {
      toast.error('Failed to load vendors')
      setIsLoading(false)
    }
  }

  const filterVendors = () => {
    let filtered = vendors

    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.products.some(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === selectedCategory)
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(vendor => vendor.languages.includes(selectedLanguage))
    }

    setFilteredVendors(filtered)
  }

  const startNegotiation = async (vendorId, productId) => {
    try {
      const response = await axios.post('/api/negotiations', {
        vendorId,
        productId,
        buyerId: 'current-user-id', // Replace with actual user ID
        initialOffer: {
          amount: 0,
          quantity: 1
        }
      })
      
      if (response.data.success) {
        toast.success('Negotiation started!')
        // Navigate to negotiation page
        window.location.href = `/negotiation/${response.data.negotiation.id}`
      }
    } catch (error) {
      toast.error('Failed to start negotiation')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Global <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-xl text-slate-600">
              Discover authentic products from local vendors worldwide
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendors or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input lg:w-48"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input lg:w-48"
            >
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-slate-600">
            Found <span className="font-semibold text-slate-900">{filteredVendors.length}</span> vendors
          </p>
        </motion.div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:shadow-lg transition-all duration-300"
            >
              {/* Vendor Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-slate-600">{vendor.owner}</p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600 ml-1">{vendor.rating}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 ml-1">{vendor.location.address}</span>
                    </div>
                  </div>
                </div>

                <div className={`w-3 h-3 rounded-full ${vendor.isOnline ? 'bg-green-400' : 'bg-slate-300'}`} />
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1 mb-4">
                {vendor.languages.map(lang => (
                  <span key={lang} className="badge badge-success text-xs">
                    {lang.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Products Preview */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-slate-700">Featured Products:</h4>
                {vendor.products.slice(0, 3).map(product => (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{product.name}</span>
                    <span className="font-medium text-slate-900">
                      ${product.basePrice}/{product.unit}
                    </span>
                  </div>
                ))}
                {vendor.products.length > 3 && (
                  <p className="text-xs text-slate-500">
                    +{vendor.products.length - 3} more products
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {vendor.totalSales} sales
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {vendor.negotiationStyle}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => startNegotiation(vendor.id, vendor.products[0]?.id)}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Start Chat
                </button>
                
                <Link
                  to={`/vendor/${vendor.id}`}
                  className="btn-secondary text-sm py-2 px-3"
                >
                  View Store
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No vendors found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedLanguage('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}